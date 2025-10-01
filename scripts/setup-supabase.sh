#!/bin/bash

# Crab Walking Adventure - Supabase Setup Script
echo "🦀 Setting up Supabase for Crab Walking Adventure..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    brew install supabase/tap/supabase
fi

echo "✅ Supabase CLI found!"

# Check if user is logged in
echo ""
echo "📝 Logging into Supabase..."
supabase login

# Prompt for project ref
echo ""
echo "🔗 Link to your Supabase project"
echo "   Get your project ref from: https://supabase.com/dashboard/project/_/settings/general"
echo "   (It's in your Project URL: https://YOUR-PROJECT-REF.supabase.co)"
echo ""
read -p "Enter your project ref: " PROJECT_REF

# Link project
supabase link --project-ref "$PROJECT_REF"

# Push migrations
echo ""
echo "🚀 Pushing database migrations..."
supabase db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo "   2. Copy your Project URL and anon key"
echo "   3. Create .env.local with:"
echo "      NEXT_PUBLIC_SUPABASE_URL=your-project-url"
echo "      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
echo ""
echo "🎮 Then run: npm run dev"
echo ""
echo "🦀 Happy gaming!"

