@echo off
echo Deploying Firebase Storage Rules...
npx firebase deploy --only storage:rules
echo Storage rules deployment complete!
pause
