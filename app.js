// Import Firebase modules
import { db, analytics, cloudinaryConfig } from './config.js';
import { collection, getDocs, doc, getDoc, onSnapshot, query, where, orderBy, addDoc, updateDoc, increment, limit, startAfter, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { t, getCurrentLanguage, setLanguage } from './translations.js';

// ========================================
// GLOBAL STATE
// ========================================

const state = {
  currentPage: 'home',
  currentArticle: null,
  currentLanguage: getCurrentLanguage(),
  articlesCache: [],
  commentsCache: {},
  currentFilter: 'all',
  currentSort: 'latest',
  currentPage: 1,
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupLanguageToggle();
  setupCursorGlow();
  setupBackToTop();
  setupMobileMenu();
  setupCookieConsent();
  loadPageContent();
});

// ========================================
// INITIALIZATION FUNCTIONS
// ========================================

function initializeApp() {
  document.documentElement.lang = state.currentLanguage;
  document.documentElement.dir = state.currentLanguage === 'ur' ? 'rtl' : 'ltr';
  document.body.setAttribute('data-lang', state.currentLanguage);
}

function setupLanguageToggle() {
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = state.currentLanguage === 'en' ? 'ur' : 'en';
      setLanguage(newLang);
    });
  }
}

function setupCursorGlow() {
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow active';
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = (e.clientX - 20) + 'px';
    cursorGlow.style.top = (e.clientY - 20) + 'px';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.classList.add('active');
  });
}

function setupBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }
}

function setupCookieConsent() {
  const cookieBanner = document.getElementById('cookie-consent');
  const acceptBtn = document.getElementById('accept-cookies');
  const rejectBtn = document.getElementById('reject-cookies');

  if (!localStorage.getItem('cookieConsent')) {
    if (cookieBanner) cookieBanner.classList.add('show');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      if (cookieBanner) cookieBanner.classList.remove('show');
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      if (cookieBanner) cookieBanner.classList.remove('show');
    });
  }
}

// ========================================
// PAGE CONTENT LOADING
// ========================================

function loadPageContent() {
  const path = window.location.pathname;

  if (path.includes('article.html')) {
    loadArticlePage();
  } else if (path.includes('reviews.html')) {
    loadReviewsPage();
  } else if (path.includes('deals.html')) {
    loadDealsPage();
  } else if (path.includes('submit.html')) {
    setupSubmitPage();
  }

  // Update UI text with translations
  updatePageTranslations();
}

// ========================================
// HOMEPAGE FUNCTIONS
// ========================================

async function loadHomepageContent() {
  const featuredSection = document.getElementById('featured-deals');
  const latestSection = document.getElementById('latest-reviews');
  const statsBar = document.getElementById('stats-bar');
  const trendingSection = document.getElementById('trending-articles');
  const mostLikedSection = document.getElementById('most-liked-articles');

  if (featuredSection) {
    const deals = await fetchDeals(3);
    featuredSection.innerHTML = deals.map(deal => createDealCard(deal)).join('');
  }

  if (latestSection) {
    const articles = await fetchArticles(6);
    latestSection.innerHTML = articles.map(article => createArticleCard(article)).join('');
  }

  if (statsBar) {
    const stats = await fetchStats();
    updateStatsBar(stats);
  }

  if (trendingSection) {
    const trending = await fetchTrendingArticles(3);
    trendingSection.innerHTML = trending.map(article => createArticleCard(article)).join('');
  }

  if (mostLikedSection) {
    const mostLiked = await fetchMostLikedArticles(3);
    mostLikedSection.innerHTML = mostLiked.map(article => createArticleCard(article)).join('');
  }
}

// ========================================
// FIREBASE FUNCTIONS
// ========================================

async function fetchArticles(limit = 10, category = 'all', sortBy = 'latest') {
  try {
    let q;
    if (category !== 'all') {
      q = query(
        collection(db, 'articles'),
        where('category', '==', category),
        orderBy(sortBy === 'latest' ? 'createdAt' : sortBy === 'liked' ? 'likes' : 'comments', 'desc'),
        limit
      );
    } else {
      q = query(
        collection(db, 'articles'),
        orderBy(sortBy === 'latest' ? 'createdAt' : sortBy === 'liked' ? 'likes' : 'comments', 'desc'),
        limit
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function fetchArticleById(articleId) {
  try {
    const docRef = doc(db, 'articles', articleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function fetchDeals(limit = 10) {
  try {
    const q = query(collection(db, 'deals'), orderBy('createdAt', 'desc'), limit);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}

async function fetchTrendingArticles(limit = 3) {
  try {
    const q = query(collection(db, 'articles'), orderBy('views', 'desc'), limit);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    return [];
  }
}

async function fetchMostLikedArticles(limit = 3) {
  try {
    const q = query(collection(db, 'articles'), orderBy('likes', 'desc'), limit);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching most liked articles:', error);
    return [];
  }
}

async function fetchComments(articleId) {
  return new Promise((resolve) => {
    const q = query(collection(db, 'comments'), where('articleId', '==', articleId), orderBy('createdAt', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      resolve(comments);
    });
  });
}

async function addComment(articleId, name, text) {
  try {
    const commentRef = await addDoc(collection(db, 'comments'), {
      articleId,
      name,
      text,
      likes: 0,
      createdAt: new Date(),
      timestamp: new Date().toLocaleString()
    });

    // Update article comment count
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      comments: increment(1)
    });

    return commentRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

async function likeArticle(articleId) {
  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking article:', error);
  }
}

async function incrementViews(articleId) {
  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

async function likeComment(commentId) {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking comment:', error);
  }
}

async function fetchStats() {
  try {
    const articlesSnap = await getDocs(collection(db, 'articles'));
    const commentsSnap = await getDocs(collection(db, 'comments'));

    return {
      totalReviews: articlesSnap.size,
      happyReaders: Math.floor(Math.random() * 50000) + 10000, // Placeholder
      dealsFound: await getDocs(collection(db, 'deals')).then(s => s.size)
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { totalReviews: 0, happyReaders: 0, dealsFound: 0 };
  }
}

// ========================================
// UI BUILDERS
// ========================================

function createArticleCard(article) {
  const categoryLabel = article.category || 'General';
  return `
    <div class="card animate-fade-in">
      <div class="card-image">
        <img src="${article.heroImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}" loading="lazy">
      </div>
      <span class="badge">${categoryLabel}</span>
      <h3 class="card-title">${article.title}</h3>
      <p class="card-desc">${(article.description || article.content).substring(0, 100)}...</p>
      <div class="card-meta">
        <span>${article.views || 0} ${t('viewCount')}</span>
        <a href="article.html?id=${article.id}" class="btn btn-ghost">${t('readMore')}</a>
      </div>
    </div>
  `;
}

function createDealCard(deal) {
  const badgeClass = deal.badge === 'hot' ? 'badge-hot' : '';
  return `
    <div class="card animate-fade-in">
      <div class="card-image">
        <img src="${deal.image || 'https://via.placeholder.com/300x200'}" alt="${deal.title}" loading="lazy">
      </div>
      ${deal.badge ? `<span class="badge ${badgeClass}">${deal.badge}</span>` : ''}
      <h3 class="card-title">${deal.title}</h3>
      <p class="card-desc">${deal.description || ''}</p>
      <div class="card-meta">
        <span>Rs. ${deal.price}</span>
        <a href="${deal.darazLink}" target="_blank" rel="noopener" class="btn btn-primary">${t('buyOnDaraz')}</a>
      </div>
    </div>
  `;
}

function updateStatsBar(stats) {
  const statsBar = document.getElementById('stats-bar');
  if (statsBar) {
    statsBar.innerHTML = `
      <div class="flex-center gap-8" style="flex-wrap: wrap;">
        <div class="text-center">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-cyan);">${stats.totalReviews}</div>
          <div style="color: var(--text-gray); font-size: 0.85rem;">${t('totalReviews')}</div>
        </div>
        <div class="text-center">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-cyan);">${stats.happyReaders}</div>
          <div style="color: var(--text-gray); font-size: 0.85rem;">${t('happyReaders')}</div>
        </div>
        <div class="text-center">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-cyan);">${stats.dealsFound}</div>
          <div style="color: var(--text-gray); font-size: 0.85rem;">${t('dealsFound')}</div>
        </div>
      </div>
    `;
  }
}

// ========================================
// REVIEWS PAGE
// ========================================

async function loadReviewsPage() {
  const articlesContainer = document.getElementById('articles-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');

  if (articlesContainer) {
    const articles = await fetchArticles(10, state.currentFilter, state.currentSort);
    articlesContainer.innerHTML = articles.map(article => createArticleCard(article)).join('') || `<p>${t('noResults')}</p>`;
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;

      if (articlesContainer) {
        const articles = await fetchArticles(10, state.currentFilter, state.currentSort);
        articlesContainer.innerHTML = articles.map(article => createArticleCard(article)).join('') || `<p>${t('noResults')}</p>`;
      }
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', async () => {
      state.currentSort = sortSelect.value;

      if (articlesContainer) {
        const articles = await fetchArticles(10, state.currentFilter, state.currentSort);
        articlesContainer.innerHTML = articles.map(article => createArticleCard(article)).join('') || `<p>${t('noResults')}</p>`;
      }
    });
  }
}

// ========================================
// ARTICLE PAGE
// ========================================

async function loadArticlePage() {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');

  if (!articleId) {
    window.location.href = 'reviews.html';
    return;
  }

  const article = await fetchArticleById(articleId);

  if (!article) {
    window.location.href = '404.html';
    return;
  }

  // Increment view count
  await incrementViews(articleId);

  // Display article
  const articleContent = document.getElementById('article-content');
  if (articleContent) {
    articleContent.innerHTML = `
      <article>
        <div class="affiliate-banner">
          ${t('affiliateNote')}
        </div>

        <img src="${article.heroImage}" alt="${article.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem;">

        <h1>${article.title}</h1>
        
        <div style="display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;">
          <span>👁 ${article.views || 0} ${t('viewCount')}</span>
          <span>❤ ${article.likes || 0} ${t('likes')}</span>
          <span>💬 ${article.comments || 0} ${t('comments')}</span>
        </div>

        <button class="btn btn-primary" onclick="likeArticleUI('${articleId}')">❤ ${t('likes')}</button>
        <button class="btn btn-secondary" onclick="shareArticle('${article.title}')">📤 ${t('share')}</button>

        <hr style="border: 1px solid var(--border-dark); margin: 2rem 0;">

        <div class="article-body">
          ${article.content}
        </div>

        ${article.images ? `
          <div style="margin: 2rem 0;">
            <h3>${t('formAdditionalImages')}</h3>
            <div class="grid-cols-3">
              ${article.images.map(img => `<img src="${img}" alt="Product" style="width: 100%; border-radius: 8px;">`).join('')}
            </div>
          </div>
        ` : ''}

        ${article.videoUrl ? `
          <div style="margin: 2rem 0;">
            <h3>Video Review</h3>
            <video style="width: 100%; max-height: 500px; border-radius: 8px;" controls>
              <source src="${article.videoUrl}" type="video/mp4">
            </video>
          </div>
        ` : ''}

        <div style="margin: 2rem 0;">
          <h3>${t('pros')}</h3>
          <ul>
            ${(article.pros || []).map(pro => `<li>✅ ${pro}</li>`).join('')}
          </ul>
        </div>

        <div style="margin: 2rem 0;">
          <h3>${t('cons')}</h3>
          <ul>
            ${(article.cons || []).map(con => `<li>❌ ${con}</li>`).join('')}
          </ul>
        </div>

        <div style="margin: 2rem 0; text-align: center;">
          <p>⭐ ${article.rating || 0} / 5</p>
          <a href="${article.darazLink}" target="_blank" class="btn btn-primary">${t('buyOnDaraz')}</a>
        </div>
      </article>
    `;
  }

  // Load comments
  loadArticleComments(articleId);
}

function likeArticleUI(articleId) {
  likeArticle(articleId);
  const btn = event.target;
  btn.textContent = '❤ ' + (parseInt(btn.textContent) + 1 || 1);
  btn.disabled = true;
}

function shareArticle(title) {
  const url = window.location.href;
  const text = `Check this out: ${title}`;

  if (navigator.share) {
    navigator.share({ title, url, text });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${text} ${url}`);
    alert('Link copied to clipboard!');
  }
}

async function loadArticleComments(articleId) {
  const commentsSection = document.getElementById('comments-section');
  
  if (!commentsSection) return;

  const comments = await fetchComments(articleId);

  commentsSection.innerHTML = `
    <div style="background: rgba(13, 27, 60, 0.5); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
      <h3>${t('commentsSection')}</h3>
      
      <form onsubmit="submitComment(event, '${articleId}')" style="margin-bottom: 2rem;">
        <div class="form-group">
          <input type="text" id="comment-name" placeholder="${t('yourName')}" required>
        </div>
        <div class="form-group">
          <textarea id="comment-text" placeholder="${t('commentPlaceholder')}" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">${t('postComment')}</button>
      </form>

      <div id="comments-list">
        ${comments.length === 0 ? `<p>${t('noComments')}</p>` : comments.map(comment => `
          <div style="background: rgba(13, 27, 60, 0.3); padding: 1rem; margin-bottom: 1rem; border-radius: 6px; border-left: 3px solid var(--secondary-cyan);">
            <strong>${comment.name}</strong>
            <span style="color: var(--text-gray); font-size: 0.8rem;"> • ${comment.timestamp || new Date(comment.createdAt.toDate()).toLocaleDateString()}</span>
            <p>${comment.text}</p>
            <button onclick="likeCommentUI('${comment.id}')" class="btn btn-ghost" style="font-size: 0.8rem;">👍 ${comment.likes || 0}</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function submitComment(event, articleId) {
  event.preventDefault();
  const name = document.getElementById('comment-name').value;
  const text = document.getElementById('comment-text').value;

  await addComment(articleId, name, text);

  document.getElementById('comment-name').value = '';
  document.getElementById('comment-text').value = '';

  loadArticleComments(articleId);
}

function likeCommentUI(commentId) {
  likeComment(commentId);
  event.target.textContent = '👍 ' + (parseInt(event.target.textContent) + 1 || 1);
}

// ========================================
// DEALS PAGE
// ========================================

async function loadDealsPage() {
  // Fetch deals and pass to frontend renderer
  try {
    const q = query(collection(db, 'deals'), where('dealEndsAt', '>', new Date()));
    const querySnapshot = await getDocs(q);
    const deals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Call the window function to render deals with filters
    if (window.loadDealsFromFirebase) {
      window.loadDealsFromFirebase(deals);
    }
  } catch (error) {
    console.error('Error loading deals page:', error);
    const grid = document.getElementById('deals-grid');
    if (grid) {
      grid.innerHTML = `<p style="color: var(--text-gray);">Error loading deals. Please refresh.</p>`;
    }
  }
}

// ========================================
// TRANSLATIONS UPDATE
// ========================================

function updatePageTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    elem.textContent = t(key);
  });
}

// ========================================
// SUBMIT PAGE SETUP
// ========================================

function setupSubmitPage() {
  const passwordForm = document.getElementById('password-form');
  const submissionForm = document.getElementById('submission-form');

  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password-input').value;

      if (password === 'PickSmart@786') {
        passwordForm.style.display = 'none';
        submissionForm.style.display = 'block';
        setupArticleSubmission();
      } else {
        alert('Wrong password');
      }
    });
  }
}

function setupArticleSubmission() {
  const form = document.getElementById('article-submit-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('content').value.substring(0, 100),
        content: document.getElementById('content').value,
        pros: document.getElementById('pros').value.split('\n').filter(p => p.trim()),
        cons: document.getElementById('cons').value.split('\n').filter(c => c.trim()),
        darazLink: document.getElementById('daraz-link').value,
        price: parseFloat(document.getElementById('price').value),
        rating: parseInt(document.getElementById('rating').value),
        createdAt: new Date(),
        views: 0,
        likes: 0,
        comments: 0
      };

      // Upload hero image to Cloudinary
      const heroImageFile = document.getElementById('hero-image').files[0];
      if (heroImageFile) {
        formData.heroImage = await uploadToCloudinary(heroImageFile);
      }

      // Upload additional images to Cloudinary
      const additionalImagesFiles = document.getElementById('additional-images').files;
      if (additionalImagesFiles.length > 0) {
        formData.images = [];
        for (let file of additionalImagesFiles) {
          const url = await uploadToCloudinary(file);
          formData.images.push(url);
        }
      }

      // Upload video to Cloudinary
      const videoFile = document.getElementById('video-upload').files[0];
      if (videoFile) {
        formData.videoUrl = await uploadToCloudinary(videoFile);
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'articles'), formData);

      // Check if should be featured as deal
      const featureAsDeal = document.getElementById('feature-as-deal').checked;
      if (featureAsDeal) {
        const dealData = {
          articleId: docRef.id,
          productName: document.getElementById('title').value,
          heroImageURL: formData.heroImage,
          originalPrice: parseFloat(document.getElementById('original-price').value),
          dealPrice: parseFloat(document.getElementById('deal-price').value),
          dealBadge: document.getElementById('deal-badge').value,
          dealEndsAt: new Date(document.getElementById('deal-end-time').value),
          darazLink: document.getElementById('daraz-link').value,
          starRating: parseInt(document.getElementById('rating').value),
          category: document.getElementById('category').value,
          views: 0,
          createdAt: new Date()
        };

        await addDoc(collection(db, 'deals'), dealData);
      }

      // Auto-generate comments
      await generateAutoComments(docRef.id);

      const message = featureAsDeal ? 'Article and Deal published successfully!' : 'Article published successfully!';
      alert(message);
      form.reset();
      document.getElementById('feature-as-deal').checked = false;
      document.getElementById('deal-fields').classList.remove('show');
    });
  }
}

// ========================================
// CLOUDINARY UPLOAD FUNCTION
// ========================================

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
}

async function generateAutoComments(articleId) {
  const names = ['Ali Raza', 'Sana Khan', 'Hamza Sheikh', 'Fatima Malik', 'Usman Tariq', 'Ayesha Noor', 'Bilal Ahmed', 'Zara Hussain'];
  const comments = [
    'Excellent review! Very helpful for my decision.',
    'Great product comparison. Definitely buying this now.',
    'Thanks for the detailed information. Really appreciated!',
    'Best review I have seen. Highly recommended!',
    'Very detailed and honest review. Keep it up!',
    'Perfect! Just what I was looking for.',
    'Amazing analysis. Bookmarking this for later.',
    'Exactly what I needed to know. Thank you!'
  ];

  for (let i = 0; i < Math.random() * 3 + 5; i++) {
    await addDoc(collection(db, 'comments'), {
      articleId,
      name: names[Math.floor(Math.random() * names.length)],
      text: comments[Math.floor(Math.random() * comments.length)],
      likes: Math.floor(Math.random() * 15) + 3,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      timestamp: new Date().toLocaleDateString()
    });
  }
}

// ========================================
// MANAGE CONTENT (Submit Page Tab 2)
// ========================================

async function loadManageContent() {
  // Load articles
  try {
    const articlesSnap = await getDocs(collection(db, 'articles'));
    const articles = articlesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const articlesList = document.getElementById('articles-list');
    if (articlesList) {
      if (articles.length === 0) {
        articlesList.innerHTML = '<p style="color: var(--text-gray);">No articles published yet.</p>';
      } else {
        articlesList.innerHTML = articles.map(article => `
          <div class="content-item">
            <div class="content-meta">
              <div style="font-weight: 600; color: var(--text-light);">${article.title}</div>
              <div style="font-size: 0.85rem; color: var(--text-gray);">
                ${new Date(article.createdAt.toDate ? article.createdAt.toDate() : article.createdAt).toLocaleDateString()} 
                • ${article.views || 0} views • ${article.likes || 0} likes
              </div>
            </div>
            <div class="content-actions">
              <button class="btn btn-danger" onclick="deleteArticle('${article.id}')">Delete</button>
            </div>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading articles:', error);
  }

  // Load deals
  try {
    const dealsSnap = await getDocs(collection(db, 'deals'));
    const deals = dealsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const dealsList = document.getElementById('deals-list');
    if (dealsList) {
      if (deals.length === 0) {
        dealsList.innerHTML = '<p style="color: var(--text-gray);">No active deals yet.</p>';
      } else {
        dealsList.innerHTML = deals.map(deal => {
          const isExpired = new Date(deal.dealEndsAt) < new Date();
          return `
            <div class="content-item">
              <div class="content-meta">
                <div style="font-weight: 600; color: var(--text-light);">${deal.productName}</div>
                <div style="font-size: 0.85rem; color: var(--text-gray);">
                  Rs. ${deal.dealPrice} • Ends: ${new Date(deal.dealEndsAt).toLocaleString()} ${isExpired ? '(Expired)' : ''}
                </div>
              </div>
              <div class="content-actions">
                <button class="btn btn-danger" onclick="deleteDeal('${deal.id}')">Delete</button>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (error) {
    console.error('Error loading deals:', error);
  }
}

async function deleteArticle(articleId) {
  if (confirm('Are you sure? This will delete the article and all its comments.')) {
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      loadManageContent();
      alert('Article deleted.');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting article.');
    }
  }
}

async function deleteDeal(dealId) {
  if (confirm('Are you sure? This will delete the deal.')) {
    try {
      await deleteDoc(doc(db, 'deals', dealId));
      loadManageContent();
      alert('Deal deleted.');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting deal.');
    }
  }
}

// Export functions for HTML onclick handlers
window.likeArticleUI = likeArticleUI;
window.shareArticle = shareArticle;
window.submitComment = submitComment;
window.likeCommentUI = likeCommentUI;
window.uploadToCloudinary = uploadToCloudinary;
window.loadHomepageContent = loadHomepageContent;
window.loadManageContent = loadManageContent;
window.deleteArticle = deleteArticle;
window.deleteDeal = deleteDeal;
