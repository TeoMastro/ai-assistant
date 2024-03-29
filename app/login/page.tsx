"use client";

import { errorToast } from "@ext/components/toasts/display-toasts";
import { AuthSchema } from "@ext/lib/client-validation-schemas";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

function Login() {
	const handleSubmit = async (formData: FormData) => {
		const itemToValidate = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }
		const result = AuthSchema.safeParse(itemToValidate);
		if (!result.success) {
			errorToast("Please check your input data");
            return;
		}

		const data = {
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		}
		const login = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        
        if (login?.error === null) {
            redirect('/');
        } else {
            errorToast("Something went wrong, please try again");
        }
	};

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Log in to an account
						</h1>
						<form
							action={handleSubmit}
						>
							<div className="mb-4">
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Your email
								</label>
								<input
									type="email"
									name="email"
									id="email"
									required
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password
								</label>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									required
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								/>
							</div>
							<button
								type="submit"
								className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
							>
								Login
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Login;
