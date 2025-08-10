cd MakePoll-backend
git stash
git stash clear
git pull
bun install
pm2 reload pm2.config.js --env production || pm2 start pm2.config.js --env production