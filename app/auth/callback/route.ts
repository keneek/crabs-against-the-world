import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('Auth callback received, code:', code ? 'present' : 'missing');

  if (code) {
    try {
      // Exchange code for session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Session exchange result:', { 
        hasSession: !!session, 
        hasUser: !!session?.user,
        error: error?.message 
      });
      
      if (error) throw error;
      
      if (session?.user) {
        const user = session.user;
        const username = user.user_metadata?.full_name || 
                        user.user_metadata?.name || 
                        user.email?.split('@')[0] || 
                        'Player';
        const avatarUrl = user.user_metadata?.avatar_url || 
                         user.user_metadata?.picture || 
                         '';
        
        console.log('User metadata:', { 
          username, 
          avatarUrl, 
          fullMetadata: user.user_metadata 
        });
        
        // Check if user exists in our database
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, username, avatar_url')
          .eq('id', user.id)
          .single();

        if (!existingUser) {
          // Create new user record
          await supabase.from('users').insert([
            {
              id: user.id,
              username: username,
              avatar_url: avatarUrl,
              total_games: 0,
              best_score: 0,
              total_shells: 0,
              bosses_defeated: 0,
            },
          ]);
        } else if (avatarUrl && existingUser.avatar_url !== avatarUrl) {
          // Update avatar if it changed
          await supabase.from('users').update({
            avatar_url: avatarUrl,
          }).eq('id', user.id);
        }

        // Redirect to home with user info in URL
        return NextResponse.redirect(
          `${requestUrl.origin}?userId=${user.id}&username=${encodeURIComponent(existingUser?.username || username)}&avatar=${encodeURIComponent(avatarUrl)}&auth=success`
        );
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}?error=auth_failed`);
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}

