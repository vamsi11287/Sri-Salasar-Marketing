import React from "react";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";

export default function BlogSection({ onSelectPost }) {
  const blogPosts =[]
  return (
    <div className="blog-page-wrapper">
      <div className="page-header-strip">
        <div className="section-container">
          <span className="page-category-tag">INDUSTRY INSIGHTS &amp; GUIDES</span>
          <h1 className="page-title">
            Packaging &amp; Electrical <span className="title-orange">Knowledge Base</span>
          </h1>
          <p className="page-subtitle">
            Expert insights, material selection guides, and best practices for modern warehouses and electrical teams.
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="blog-posts-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-post-card">
              <div className="blog-card-top">
                <span className="blog-cat-badge">{post.category}</span>
                <span className="blog-read-time">
                  <Clock size={13} /> {post.readTime}
                </span>
              </div>

              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-summary">{post.summary}</p>

              <div className="blog-card-footer">
                <div className="blog-meta">
                  <span className="meta-item">
                    <Calendar size={13} /> {post.date}
                  </span>
                  <span className="meta-divider">•</span>
                  <span className="meta-item">
                    <User size={13} /> {post.author}
                  </span>
                </div>
                <button
                  className="read-more-btn"
                  onClick={() => alert(`Reading article: "${post.title}"\n\n${post.summary}`)}
                >
                  Read Article <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
