import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

const FileSchema = z.object({
	file: z
		.instanceof(Blob)
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: 'File size should be less than 5MB'
		})
		// Update the file type based on the kind of files you want to accept
		.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
			message: 'File type should be JPEG or PNG'
		})
});

export async function POST({ request, locals: { user } }) {
	if (!user) {
		error(401, 'Unauthorized');
	}

	if (request.body === null) {
		error(400, 'Empty file received');
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return error(400, 'No file uploaded');
		}

		const validatedFile = FileSchema.safeParse({ file });

		if (!validatedFile.success) {
			const errorMessage = validatedFile.error.errors.map((error) => error.message).join(', ');

			return error(400, errorMessage);
		}

		// Get filename from formData since Blob doesn't have name property
		const filename = file.name;
		const fileBuffer = await file.arrayBuffer();

		try {
			const data = await put(`${filename}`, fileBuffer, {
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN
			});

			return Response.json(data);
		} catch (e) {
			console.error(e);
			return error(500, 'Upload failed');
		}
	} catch (e) {
		console.error(e);
		return error(500, 'Failed to process request');
	}
}
