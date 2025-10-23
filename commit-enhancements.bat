@echo off
echo Committing all StudySnap enhancements...

REM Add all changes
git add .

REM Commit with descriptive message
git commit -m "🚀 MAJOR ENHANCEMENT: Enhanced AI Intelligence + Pro Plan System

✅ Enhanced AI Quiz Generation:
- Upgraded to GPT-4 for superior content analysis
- Deep contextual understanding and intelligent question types
- Never uses headings as questions - focuses on actual content understanding
- Progressive difficulty levels (basic → advanced)

✅ Free Plan Limits (2 uploads/week, 2 generations/week):
- Complete usage tracking system with weekly resets
- Real-time usage display and limit enforcement
- Graceful error handling with upgrade prompts

✅ Pro Plan Features (£5.99/month):
- Unlimited uploads and generations
- Enhanced GPT-4 AI with optimized parameters
- Faster response times and priority processing
- Advanced content analysis with deep contextual understanding

✅ Technical Enhancements:
- Usage tracking module for centralized management
- API routes for usage management and limits
- Frontend integration with real-time usage display
- Comprehensive error handling for all scenarios
- Pro upgrade flow with pricing and features

🎯 Ready for production deployment with enterprise-grade AI intelligence!"

REM Push to GitHub
git push origin main

echo ✅ All enhancements committed and pushed to GitHub!
echo 🚀 Your StudySnap app now has professional-grade AI intelligence!
