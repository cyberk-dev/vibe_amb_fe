"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
import { useVerifyInviteCode } from "@/features/verify-invite-code";
import { SoundButton } from "@/shared/ui/sound-button";
import { GameFormField } from "@/shared/ui/form-field";

/**
 * Invite Code Screen - OTP Gate (Pre-Auth)
 *
 * This is the first step in the lobby flow as documented in docs/lobby/lobby.md
 *
 * Flow:
 * 1. User enters 6-digit OTP code and name
 * 2. Client calls POST /lobby/verify-otp
 * 3. Server validates OTP (unused, not expired/revoked)
 * 4. Server atomically marks OTP as used and issues otpToken (short-lived)
 * 5. Client stores otpToken (sessionStorage for MVP, httpOnly cookie preferred)
 * 6. Client redirects to landing/auth page (wallet or Google login)
 *
 * Design: Based on Figma design at node 3:52
 * - Background: custom-vivid-red (#ef4523)
 * - Decorative circles with floating animations
 * - Form with OTP input (6 digits) and name input
 * - Fonts: Bricolage Grotesque (title), Space Grotesk (form)
 *
 * API Integration:
 * - Endpoint: POST /lobby/verify-otp
 * - Request: { otpCode: string }
 * - Response: { otpToken: string, expiresInSec: number }
 * - Errors: OTP_INVALID, OTP_ALREADY_USED_OR_REVOKED, OTP_EXPIRED
 *
 * @see docs/lobby/lobby.md for complete flow documentation
 */

// ========================================
// Constants - Hoisted for performance
// ========================================

/** OTP code validation constants */
const OTP_CODE_LENGTH = 6;
const OTP_CODE_PATTERN = /^\d{6}$/;
const NON_DIGIT_REGEX = /\D/g;

/** Static decorative circles - hoisted to prevent re-creation on every render */
const DECORATIVE_CIRCLES = (
  <>
    <div className="absolute w-[524.658px] h-[524.658px] rounded-full bg-custom-light-orange animate-float top-[354px] left-[639px] will-change-transform" />
    <div className="absolute w-[431.213px] h-[431.213px] rounded-full bg-custom-very-dark-blue animate-float-delayed top-[360.37px] left-[965.68px] will-change-transform" />
  </>
);

// ========================================
// Component
// ========================================

export function InviteCodeScreen() {
  const router = useRouter();
  const intl = useIntl();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [errorId, setErrorId] = useState<"invite_code.errors.invalid_code" | "invite_code.errors.missing_name" | null>(
    null,
  );
  const [isMuted, setIsMuted] = useState(false);

  const verifyInviteCode = useVerifyInviteCode();
  const codePlaceholder = intl.formatMessage({ id: "invite_code.form.code_placeholder" });
  const namePlaceholder = intl.formatMessage({ id: "invite_code.form.name_placeholder" });

  // ========================================
  // Event Handlers - Memoized for performance
  // ========================================

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorId(null);

      // Client-side validation
      if (code.length !== OTP_CODE_LENGTH || !OTP_CODE_PATTERN.test(code)) {
        setErrorId("invite_code.errors.invalid_code");
        return;
      }

      if (!name.trim()) {
        setErrorId("invite_code.errors.missing_name");
        return;
      }

      // TODO: TEMPORARY LOGIC - Remove this when API is available
      // Currently skipping API verification and navigating directly to landing page
      // When ready, uncomment the API call below and remove this direct navigation
      sessionStorage.setItem("otpCode", code);
      sessionStorage.setItem("playerName", name.trim());
      router.push("/landing");
      return;

      // TODO: Uncomment this block when API is ready
      // try {
      //   // Call verify OTP mutation
      //   const response = await verifyInviteCode.mutateAsync({
      //     otpCode: code,
      //   });

      //   // Store otpToken for auth flow (temporary session)
      //   // TODO: Store in secure storage (httpOnly cookie preferred, or sessionStorage for MVP)
      //   sessionStorage.setItem("otpToken", response.otpToken);
      //   sessionStorage.setItem("playerName", name.trim());

      //   // Redirect to landing/auth page
      //   // TODO: Replace with actual landing route once created
      //   router.push("/wallet-connect");
      // } catch (err: any) {
      //   // Handle API errors as per docs/lobby/lobby.md
      //   // TODO: Map API error codes to i18n keys and setErrorId(...) here.
      //   setErrorId("invite_code.errors.invalid_code");
      // }
    },
    [code, name, router],
  );

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(NON_DIGIT_REGEX, "").slice(0, OTP_CODE_LENGTH);
    setCode(value);
    setErrorId(null);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrorId(null);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <div className="h-full bg-custom-vivid-red overflow-hidden relative">
      {/* Decorative circles - static, hoisted for performance */}
      {DECORATIVE_CIRCLES}

      {/* Sound button */}
      <SoundButton
        isMuted={isMuted}
        onToggle={toggleMute}
        iconColor="text-custom-vivid-red"
        className="absolute top-6 right-6"
      />

      {/* Main content */}
      <div className="h-full flex flex-col justify-between p-6 md:p-12 relative z-10">
        {/* Hero title */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[1027px]">
            <div className="animate-fade-in-left">
              <h1 className="font-bold leading-[0.9] text-white font-bricolage text-[160px] [font-variation-settings:'opsz'_14,'wdth'_100]">
                <span className="block whitespace-nowrap">
                  <FormattedMessage
                    id="invite_code.hero.line1"
                    values={{
                      money: (chunks: ReactNode) => <span className="text-custom-light-orange">{chunks}</span>,
                    }}
                  />
                </span>
                <span className="block whitespace-nowrap">
                  <FormattedMessage
                    id="invite_code.hero.line2"
                    values={{
                      battle: (chunks: ReactNode) => <span className="text-custom-very-dark-blue">{chunks}</span>,
                    }}
                  />
                </span>
              </h1>
              <p className="text-white/60 text-[20px] uppercase tracking-[1.2px] mt-6 font-normal font-space">
                <FormattedMessage id="invite_code.hero.byline" />
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section with form */}
        <div className="w-full max-w-[576px]">
          <div className="border-2 border-[rgba(255,228,220,0.5)] p-8 md:p-9 bg-white/10 backdrop-blur-sm animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Code Input */}
              <GameFormField>
                <GameFormField.Label variant="game">
                  <FormattedMessage id="invite_code.form.code_label" />
                </GameFormField.Label>
                <GameFormField.Input
                  variant="game-code"
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder={codePlaceholder}
                  maxLength={6}
                  disabled={verifyInviteCode.isPending}
                />
              </GameFormField>

              {/* Name Input */}
              <GameFormField>
                <GameFormField.Label variant="game">
                  <FormattedMessage id="invite_code.form.name_label" />
                </GameFormField.Label>
                <GameFormField.Input
                  variant="game-text"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder={namePlaceholder}
                  disabled={verifyInviteCode.isPending}
                />
              </GameFormField>

              {/* Error message */}
              {errorId && (
                <p className="text-white text-sm animate-fade-in font-space">
                  → <FormattedMessage id={errorId} />
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={verifyInviteCode.isPending}
                className="group flex items-center gap-3 text-white text-xl font-medium hover:text-yellow-200 transition-colors pt-2 disabled:opacity-50 disabled:cursor-not-allowed font-space"
              >
                <span className="uppercase tracking-wider">
                  <FormattedMessage
                    id={verifyInviteCode.isPending ? "invite_code.form.submitting" : "invite_code.form.submit"}
                  />
                </span>
                <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
