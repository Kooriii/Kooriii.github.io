# Blog Posts

This directory contains all blog posts in markdown format.

## How to Add a New Blog Post

1. Create a new markdown file in this directory (e.g., `my-new-post.md`)
2. Add an entry to `posts.json` with the following structure:

  ```json
  {
    "id": "unique-post-id",
    "title": "Post Title",
    "date": "YYYY-MM-DD",
    "excerpt": "Brief description of the post",
    "file": "my-new-post.md"
  }
  ```

1. Write your content in markdown format
2. The blog system will automatically load and display your post

## Markdown Support

The blog system supports basic markdown formatting:

- Headers (`#`, `##`, `###`)
- Bold text (`**text**`)
- Italic text (`*text*`)
- Links (`[text](url)`)
- Lists (using `*` for bullet points)

## Note

All blog posts are static and loaded directly from these markdown files. No external dependencies or dynamic content loading is required.
