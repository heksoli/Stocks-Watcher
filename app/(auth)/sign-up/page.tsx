"use client";

import {Loader2} from "lucide-react";
import {useForm} from "react-hook-form";
import FooterLink from "@/components/footer-link";
import CountriesSelectField from "@/components/forms/countries-select-field";
import InputField from "@/components/forms/input-field";
import SelectField from "@/components/forms/select-field";
import {Button} from "@/components/ui/button";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS,} from "@/lib/constants";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "RO",
      investmentGoals: "",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.fullName}
          validation={{
            required: "Full Name is required",
          }}
        />

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

        <CountriesSelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />

        <SelectField
          name="investmentGoals"
          label="Investment Goal"
          placeholder="select your investment goal"
          options={INVESTMENT_GOALS}
          error={errors.investmentGoals}
          control={control}
          required={true}
        />

        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="select your risk level"
          options={RISK_TOLERANCE_OPTIONS}
          error={errors.riskTolerance}
          control={control}
          required={true}
        />

        <SelectField
          name="preferredIndustry"
          label="Preffered Industry"
          placeholder="select your preffered industry"
          options={PREFERRED_INDUSTRIES}
          error={errors.preferredIndustry}
          control={control}
          required={true}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Start Your Investing Journey"
          )}
        </Button>

        <FooterLink
          text="Already have an account?"
          linkText="Sign in"
          href="/sign-in"
        />
      </form>
    </>
  );
};

export default SignUpPage;
