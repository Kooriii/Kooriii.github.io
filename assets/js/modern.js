// Modern JavaScript for the website

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active')
        ? 'rotate(45deg) translateY(8px)'
        : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active')
        ? 'rotate(-45deg) translateY(-8px)'
        : 'none';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Height of navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Blog System with Markdown Support
class BlogSystem {
    constructor() {
        this.blogContainer = document.getElementById('blogContainer');
        this.blogPosts = [];
        this.init();
    }

    async init() {
        await this.loadBlogPosts();
        this.renderBlogPosts();
    }

    async loadBlogPosts() {
        try {
            // Load blog posts index
            const response = await fetch('/blog/posts.json');
            const data = await response.json();

            // Load content for each post
            for (const post of data.posts) {
                const contentResponse = await fetch(`/blog/${post.file}`);
                const content = await contentResponse.text();
                this.blogPosts.push({
                    ...post,
                    content: content
                });
            }
        } catch (error) {
            console.log('Loading default blog post');
            // Fallback to embedded post if files not found
            this.blogPosts = [
                {
                    id: 'welcome-2024',
                    title: "Welcome to My New Blog",
                    date: "2024-01-15",
                    excerpt: "This is the first post on my newly redesigned website. I'll be sharing thoughts on software development, cybersecurity, and technology.",
                    content: `# Welcome to My New Blog

This is the first post on my newly redesigned website. I'm excited to share my journey and insights with you through this platform.

## What to Expect

I'll be writing about various topics that interest me:

- **C++ and System Programming**: Deep dives into advanced C++ techniques, performance optimization, and system-level programming
- **Cybersecurity**: Best practices, emerging threats, and defensive strategies
- **Blockchain Technology**: Exploring the intersection of distributed systems and security
- **AI and Machine Learning**: Practical applications and integration with traditional software engineering
- **Project Updates**: Behind-the-scenes looks at my current projects and development process

## Why This Blog?

As someone who loves to learn and explore new technologies, I believe in the power of sharing knowledge. This blog serves as:

1. A platform to document my learning journey
2. A way to give back to the developer community
3. A space for technical discussions and exchange of ideas

## Get In Touch

Feel free to reach out if you have questions, suggestions for topics, or just want to connect. You can find me on [GitHub](https://github.com/Kooriii) or [LinkedIn](https://www.linkedin.com/in/alvin-koori/).

Stay tuned for more technical content, tutorials, and project showcases!

---

*Thank you for visiting my blog. Let's learn and grow together in this exciting world of technology.*`
                }
            ];
        }
    }

    renderBlogPosts() {
        if (this.blogPosts.length === 0) {
            this.blogContainer.innerHTML = `
                <div class="blog-empty">
                    <p>No blog posts yet. Check back soon!</p>
                </div>
            `;
            return;
        }

        this.blogContainer.innerHTML = this.blogPosts.map(post => `
            <article class="blog-post" data-post-id="${post.id}">
                <h3>${post.title}</h3>
                <div class="blog-post-date">${this.formatDate(post.date)}</div>
                <div class="blog-post-excerpt">${post.excerpt}</div>
            </article>
        `).join('');

        // Add click handlers to blog posts
        document.querySelectorAll('.blog-post').forEach(post => {
            post.addEventListener('click', () => {
                const postId = post.dataset.postId;
                this.showBlogPost(postId);
            });
        });
    }

    showBlogPost(postId) {
        const post = this.blogPosts.find(p => p.id == postId);
        if (!post) return;

        // Convert markdown to HTML (basic implementation)
        const htmlContent = this.markdownToHtml(post.content);

        // Create modal to show full post
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-content">
                <button class="blog-modal-close">&times;</button>
                <article class="blog-full-post">
                    <h1>${post.title}</h1>
                    <div class="blog-post-date">${this.formatDate(post.date)}</div>
                    <div class="blog-content">${htmlContent}</div>
                </article>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.blog-modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    markdownToHtml(markdown) {
        // Enhanced markdown to HTML conversion
        let html = markdown;

        // Code blocks
        html = html.replace(/```([^`]*)```/g, '<pre><code>$1</code></pre>');

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Italic - more precise to avoid conflicts with lists
        html = html.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Numbered lists
        html = html.replace(/^\d+\. (.+)$/gim, '<oli>$1</oli>');
        html = html.replace(/(<oli>.*<\/oli>)/s, (match) => {
            const items = match.replace(/<\/?oli>/g, '');
            return '<ol>' + items.split('\n').filter(item => item.trim()).map(item => '<li>' + item + '</li>').join('') + '</ol>';
        });

        // Bullet lists
        html = html.replace(/^[\*\-] (.+)$/gim, '<uli>$1</uli>');
        html = html.replace(/(<uli>[\s\S]*?<\/uli>)(?!\n<uli>)/g, (match) => {
            const items = match.replace(/<\/?uli>/g, '');
            return '<ul>' + items.split('\n').filter(item => item.trim()).map(item => '<li>' + item + '</li>').join('') + '</ul>';
        });

        // Horizontal rule
        html = html.replace(/^---$/gim, '<hr>');

        // Paragraphs
        html = html.split('\n\n').map(paragraph => {
            if (paragraph.startsWith('<h') || paragraph.startsWith('<ul') || paragraph.startsWith('<ol') || paragraph.startsWith('<pre')) {
                return paragraph;
            }
            return '<p>' + paragraph + '</p>';
        }).join('\n');

        // Clean up
        html = html.replace(/<p><h/g, '<h');
        html = html.replace(/<\/h(\d)><\/p>/g, '</h$1>');
        html = html.replace(/<p><ul>/g, '<ul>');
        html = html.replace(/<\/ul><\/p>/g, '</ul>');
        html = html.replace(/<p><ol>/g, '<ol>');
        html = html.replace(/<\/ol><\/p>/g, '</ol>');
        html = html.replace(/<p><hr><\/p>/g, '<hr>');

        return html;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
}

// Initialize blog system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BlogSystem();
});

// Add blog modal styles dynamically
const modalStyles = `
    .blog-modal {
        display: flex;
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        align-items: center;
        justify-content: center;
        padding: var(--spacing-lg);
    }

    .blog-modal-content {
        background: var(--surface);
        border-radius: 12px;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        padding: var(--spacing-2xl);
        position: relative;
    }

    .blog-modal-close {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
        background: transparent;
        border: none;
        font-size: 2rem;
        color: var(--text-secondary);
        cursor: pointer;
        transition: var(--transition);
    }

    .blog-modal-close:hover {
        color: var(--primary-color);
    }

    .blog-full-post h1 {
        color: var(--primary-color);
        margin-bottom: var(--spacing-sm);
    }

    .blog-content {
        margin-top: var(--spacing-xl);
        line-height: 1.8;
    }

    .blog-content h2 {
        color: var(--primary-light);
        margin: var(--spacing-xl) 0 var(--spacing-md) 0;
    }

    .blog-content h3 {
        color: var(--primary-color);
        margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
    }

    .blog-content ul {
        margin: var(--spacing-md) 0;
        padding-left: var(--spacing-xl);
    }

    .blog-content li {
        margin: var(--spacing-xs) 0;
        color: var(--text-secondary);
    }

    .blog-content a {
        color: var(--accent);
        text-decoration: none;
    }

    .blog-content a:hover {
        text-decoration: underline;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 1.5));
    }
});

// Add subtle animations on scroll
window.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Also animate individual elements within sections
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Animate project cards, blog posts, and other content
    setTimeout(() => {
        document.querySelectorAll('.project-card, .blog-post, .about-grid, .resume-content, .contact-content').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            elementObserver.observe(element);
        });
    }, 100); // Small delay to ensure blog posts are loaded
});
