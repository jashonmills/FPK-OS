-- Create Waterford and Wexford Education and Training Board organization
DO $$
DECLARE
    org_id UUID := gen_random_uuid();
    invite_code TEXT := 'inv_' || encode(gen_random_bytes(16), 'hex');
    admin_user_id UUID := 'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID; -- Placeholder - will be updated when admin creates it properly
BEGIN
    -- Insert organization
    INSERT INTO public.organizations (
        id,
        name,
        description,
        slug,
        plan,
        seat_cap,
        instructor_limit,
        seats_used,
        instructors_used,
        owner_id,
        created_by,
        status,
        created_at,
        updated_at
    ) VALUES (
        org_id,
        'Waterford and Wexford Education and Training Board',
        'Bord Oideachais agus Oiliúna Phort Láirge agus Loch Garman - Education and Training Board serving Waterford and Wexford counties. Located at Gonzaga House, Enniscorthy, Co. Wexford Y21 K702.',
        'waterford-wexford-etb',
        'beta',
        50,  -- Beta plan: 50 student seats
        20,  -- Beta plan: 20 instructor seats
        0,   -- No seats used initially
        0,   -- No instructors used initially
        admin_user_id,
        admin_user_id,
        'active',
        now(),
        now()
    );

    -- Create initial admin membership (will be updated when real admin claims the org)
    INSERT INTO public.org_members (
        org_id,
        user_id,
        role,
        status,
        joined_at,
        created_at
    ) VALUES (
        org_id,
        admin_user_id,
        'owner',
        'active',
        now(),
        now()
    );

    -- Create invite link for instructors to join
    INSERT INTO public.org_invites (
        org_id,
        code,
        role,
        max_uses,
        uses_count,
        expires_at,
        created_by,
        created_at
    ) VALUES (
        org_id,
        invite_code,
        'instructor',
        100,
        0,
        now() + interval '30 days',
        admin_user_id,
        now()
    );

    -- Output the results
    RAISE NOTICE 'Organization created successfully!';
    RAISE NOTICE 'Organization ID: %', org_id;
    RAISE NOTICE 'Organization Slug: waterford-wexford-etb';
    RAISE NOTICE 'Invite Code: %', invite_code;
    RAISE NOTICE 'Invite URL: /join?code=%', invite_code;
    RAISE NOTICE 'Beta Plan: 50 student seats, 20 instructor seats (FREE)';
END $$;