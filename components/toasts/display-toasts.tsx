"use client";

import { toast } from "sonner";

export const successToast = (message: string ) => {
	toast.success(message)
}