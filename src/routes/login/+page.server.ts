
import type {Actions} from "@sveltejs/kit";

export  const actions: Actions = {
    login: async ({request}) => {
        const formData = await request.formData()

        const email = formData.get('email') ?? ''
        const password = formData.get('password') ?? ''
    }

    // const secret
}