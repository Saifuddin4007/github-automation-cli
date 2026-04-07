# github-automation-cli
A powerful GitHub Automation CLI Tool designed to automate the complete Git and GitHub workflow using a single command.  This tool eliminates repetitive manual steps and simplifies the entire development lifecycle from project initialization to pushing code to a remote repository making it ideal for developers who want speed and consistency.
# 🚀 MyGit CLI — Git & GitHub Automation Tool

A powerful CLI tool to automate Git and GitHub workflows — initialize repos, commit, create GitHub repositories, and push code — all with a single command.

---

## ✨ Features

- ⚡ One-command Git + GitHub workflow
- 📦 Initialize Git repository automatically
- 📝 Stage & commit files (all or specific)
- 🌐 Create GitHub repository
- 🔗 Add remote origin automatically
- 🚀 Push to GitHub
- 🔐 Secure token storage (Keytar support)
- 🔁 Rollback on failure (auto delete repo if push fails)
- 💬 Interactive prompts (Inquirer)
- 🧠 Smart handling of edge cases

---

## 📦 Installation

### Install globally via npm:

```bash
npm install -g mygit-cli




🧠 Commands & Usage


🔹 Full Automation (Default Command)
📌 Syntax:
Bash:
mygit "your commit message"

✅ What it does:
Initializes Git repository (if not exists)
Stages all files
Creates commit
Creates GitHub repository (if not exists)
Adds remote origin
Pushes code to GitHub


💬 Interactive Mode
If you run:
Bash:
mygit
You will be prompted:
Enter commit message
Make repository private? (yes/no)


🔹 Commit Only
📌 Syntax:
Bash:
mygit commit "message"
✅ What it does:
Initializes Git repo if needed
Stages files
Creates commit


📂 Commit Specific Files
Bash:
mygit commit "message" file1.txt file2.js
Only selected files will be committed.

💬 Interactive Mode
Bash:
mygit commit
Prompts for commit message.


🔹 Push Only
📌 Syntax:
Bash:
mygit push
✅ What it does:
Pushes committed changes to GitHub

⚠️ Requirements:
Git repository must exist
Remote origin must be configured


🔹 Init Only
📌 Syntax:
Bash:
mygit init
✅ What it does:
Initializes Git repository
Creates GitHub repository
Adds remote origin


🔒 Private Repo Option
Bash:
mygit init --private




## Disclaimer

This tool is not affiliated with or endorsed by GitHub. 
It uses GitHub’s public APIs to automate workflows.