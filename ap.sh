# ap is for amend push
f() {
    git add . && git commit --amend --no-edit && git push -f
}

# README.md is a hard-link lol
f && cd ../anarhehest/ && f
