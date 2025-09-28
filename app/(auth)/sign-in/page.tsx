"use client";

import {Loader2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import FooterLink from "@/components/footer-link";
import InputField from "@/components/forms/input-field";
import {Button} from "@/components/ui/button";
import {signIn} from "@/lib/actions/sign-in";
import {logger} from "@/lib/logger";

const SignInPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const { success } = await signIn(data);
      if (success) {
        router.push("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      logger.error(err);

      toast.error("Invalid email or password");
    }
  };

  return (
    <>
      <h1 className="form-title">
        Login Into {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="john.doe@example.com"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^\w+@\w+\.\w+$/,
              message: "Invalid email address",
            },
          }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 32,
              message: `Password can have at most 32 characters`,
            },
          }}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign in"}
        </Button>
      </form>

      <FooterLink
        text="Don't have an account?"
        linkText="Sign up"
        href="/sign-up"
      />
    </>
  );
};

export default SignInPage;
