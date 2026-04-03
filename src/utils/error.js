class GitError extends Error {}
class GitHubError extends Error {}
class AuthError extends Error {}

module.exports= {
    GitError,
    GitHubError,
    AuthError
}