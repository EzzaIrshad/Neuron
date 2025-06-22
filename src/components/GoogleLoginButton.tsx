'use client';

import { useCallback, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserModel } from '@/types/UserModel';
// import { useRouter } from 'next/navigation';

declare const google: {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        nonce: string;
        use_fedcm_for_prompt: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement | null,
        options: {
          theme: string;
          size: string;
          text: string;
          shape: string;
          logo_alignment: string;
          width: number;
        }
      ) => void;
    };
  };
};

interface Props {
  onUserNotFound: () => void;
}

export default function GoogleLoginButton({ onUserNotFound }: Props) {
  // const router = useRouter();
  const supabase = createClient();
  const nonceRef = useRef<string | null>(null);

  const generateNonce = async (): Promise<[string, string]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return [nonce, hashedNonce];
  };

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const decoded = jwtDecode<{ email: string; name: string; picture: string }>(response.credential);
      console.log('Decoded Google token:', decoded);

      const nonce = nonceRef.current;
      if (!nonce) {
        console.error('Nonce is missing');
        return;
      }

      const { error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce,
      });

      if (authError) {
        console.error('Supabase auth error:', authError.message);
        if (authError.status === 404 || authError.message.includes('User not found')) {
          onUserNotFound();
        }
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!userData?.user || userError) {
        console.error('Error getting user:', userError?.message);
        return;
      }

      const userId = userData.user.id;

const { data: profileData, error: fetchError } = await supabase
  .from('profiles')
  .select(`
    full_name,
    email,
    avatar_url,
    role_id(role_name),
    is_active,
    storage_limit_gb,
    storage_used_gb,
    current_package,
    package_expiry_date,
    plan_started_at,
    payment_status,
    is_email_verified,
    last_login,
    signup_source,
    referral_code,
    referred_by,
    country,
    phone_number,
    organization,
    website,
    bio,
    profile_completed,
    preferred_language,
    price,
    order_number,
    created_at
  `)
  .eq('id', userId)
  .single();

if (fetchError || !profileData) {
  console.error('Error fetching profile:', fetchError?.message);
  return;
}

// ✅ Final structured UserModel with safe fallbacks
const userModel: UserModel = {
  id: userId,
  full_name: profileData.full_name ?? null,
  email: profileData.email ?? '',
  avatar_url: profileData.avatar_url ?? null,
  role: {
    role_name: profileData.role_id?.role_name ?? 'user', // 👈 fallback to 'user'
  },
  is_active: profileData.is_active ?? true,
  storage_limit_gb: profileData.storage_limit_gb ?? 5,
  storage_used_gb: profileData.storage_used_gb ?? 0,
  current_package: profileData.current_package ?? 'free',
  package_expiry_date: profileData.package_expiry_date ?? null,
  plan_started_at: profileData.plan_started_at ?? null,
  payment_status: profileData.payment_status ?? 'unpaid',
  is_email_verified: profileData.is_email_verified ?? false,
  last_login: profileData.last_login ?? null,
  signup_source: profileData.signup_source ?? 'google',
  referral_code: profileData.referral_code ?? null,
  referred_by: profileData.referred_by ?? null,
  country: profileData.country ?? null,
  phone_number: profileData.phone_number ?? null,
  organization: profileData.organization ?? null,
  website: profileData.website ?? null,
  bio: profileData.bio ?? null,
  profile_completed: profileData.profile_completed ?? false,
  preferred_language: profileData.preferred_language ?? 'en',
  price: profileData.price ?? 0,
  order_number: profileData.order_number ?? 0,
  created_at: profileData.created_at ?? new Date().toISOString(),
};

useAuthStore.getState().setUser(userModel);
useAuthStore.getState().setLogoUrl(userModel.avatar_url || '');
    } catch (err) {
      console.error('Error processing Google sign-in:', err);
    }
  }, [supabase, onUserNotFound]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error('Google Client ID is not set');
      return;
    }

    const initGoogleSignIn = async () => {
      const [generatedNonce, hashedNonce] = await generateNonce();
      nonceRef.current = generatedNonce;

      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      });

      google.accounts.id.renderButton(document.getElementById('google-button'), {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: 280,
      });
    };

    const scriptId = 'google-gsi-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.id = scriptId;
      script.onload = initGoogleSignIn;
      script.onerror = () => console.error('Failed to load Google Sign-In script');
      document.body.appendChild(script);
    } else {
      initGoogleSignIn();
    }
  }, [handleCredentialResponse]);

  return <div id="google-button" />;
}