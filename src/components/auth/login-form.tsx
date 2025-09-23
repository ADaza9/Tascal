"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, ActionState } from "@/lib/auth-actions";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-primary w-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Iniciando sesión...
        </>
      ) : (
        "Iniciar Sesión"
      )}
    </button>
  );
}

export function LoginForm({isDev}: {isDev: boolean}) {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="card w-full max-w-md shadow-xl bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center justify-center mb-6">
          Iniciar Sesión
        </h2>

        <form action={formAction} className="space-y-4">
          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              className={`input input-bordered w-full ${
                state.fieldErrors?.email ? "input-error" : ""
              }`}
              required
            />
            {state.fieldErrors?.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {state.fieldErrors.email[0]}
                </span>
              </label>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Contraseña</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Tu contraseña"
                className={`input input-bordered w-full pr-10 ${
                  state.fieldErrors?.password ? "input-error" : ""
                }`}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {state.fieldErrors?.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {state.fieldErrors.password[0]}
                </span>
              </label>
            )}
          </div>

          {/* General Error */}
          {state.error && (
            <div className="alert alert-error">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{state.error}</span>
            </div>
          )}

          {/* Success Message */}
          {state.success && (
            <div className="alert alert-success">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{state.success}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-control mt-6">
            <SubmitButton />
          </div>
        </form>

        {/* Demo Credentials */}
        {isDev &&  (<>
        <div className="divider">Cuentas de prueba</div>
        <div className="bg-base-200 p-4 rounded-lg text-sm space-y-2">
          <div>
            <span className="font-semibold">Super Admin:</span>
            <br />
            superadmin@example.com / SuperAdmin123!
          </div>
          <div>
            <span className="font-semibold">Supervisor:</span>
            <br />
            supervisor@example.com / Supervisor123!
          </div>
          <div>
            <span className="font-semibold">Técnico:</span>
            <br />
            technician@example.com / Technical123!
          </div>
        </div>
        </>
       ) }
      </div>
    </div>
  );
}