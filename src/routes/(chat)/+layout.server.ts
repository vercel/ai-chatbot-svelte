export function load({ cookies, locals }) {
	const { user } = locals;
	const sidebarCollapsed = cookies.get('sidebar:state') !== 'true';

	return {
		user,
		sidebarCollapsed
	};
}
