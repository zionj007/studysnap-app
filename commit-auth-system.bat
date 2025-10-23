@echo off
echo Committing authentication system changes...

cd /d "C:\Users\Surface Pro\OneDrive\Desktop\studentapp"

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Add complete authentication system with admin panel

- Added user registration and login functionality
- Implemented JWT token authentication with bcryptjs
- Created admin panel with user management
- Added role-based access control (admin vs user)
- Integrated authentication with usage tracking
- Admin credentials: admin@studysnap.com / admin123
- Admin has unlimited access and can upgrade users to Pro
- Added beautiful login/register UI components
- Updated all API calls to use authentication headers
- Enhanced security with password hashing and session management"

echo Pushing to GitHub...
git push origin main

echo Done! Authentication system deployed.
pause
