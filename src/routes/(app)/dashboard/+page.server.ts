import type { PageServerLoad } from "../../logout/$types"

export const load: PageServerLoad = async ({ locals }) => {
	// user is already logged	
	const { user } = locals;
	return user;
}
