// Quick SEO Testing Script
const https = require('https');
const http = require('http');

const testUrl = 'http://localhost:3000';

console.log('🧪 Testing SEO Optimization Locally...\n');

// Test function
function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const url = `${testUrl}${path}`;
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ ${description}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${res.statusCode}`);
        
        // Check for specific SEO elements
        if (path === '/') {
          checkSEOElements(data, 'Home Page');
        } else if (path === '/sitemap.xml') {
          checkSitemap(data);
        } else if (path === '/robots.txt') {
          checkRobots(data);
        }
        
        console.log('');
        resolve();
      });
    }).on('error', (err) => {
      console.log(`❌ ${description}`);
      console.log(`   Error: ${err.message}`);
      console.log('');
      reject(err);
    });
  });
}

// Check SEO elements in HTML
function checkSEOElements(html, pageName) {
  const checks = [
    { name: 'Title Tag', pattern: /<title>.*<\/title>/i, found: false },
    { name: 'Meta Description', pattern: /<meta name="description"/i, found: false },
    { name: 'Open Graph Title', pattern: /<meta property="og:title"/i, found: false },
    { name: 'Open Graph Description', pattern: /<meta property="og:description"/i, found: false },
    { name: 'Twitter Card', pattern: /<meta name="twitter:card"/i, found: false },
    { name: 'Structured Data (JSON-LD)', pattern: /<script type="application\/ld\+json"/i, found: false },
    { name: 'Canonical URL', pattern: /<link rel="canonical"/i, found: false },
    { name: 'Viewport Meta Tag', pattern: /<meta name="viewport"/i, found: false }
  ];
  
  console.log(`   📊 SEO Elements Check for ${pageName}:`);
  
  checks.forEach(check => {
    if (check.pattern.test(html)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - MISSING`);
    }
  });
}

// Check sitemap
function checkSitemap(xml) {
  console.log('   📊 Sitemap Check:');
  
  if (xml.includes('<?xml')) {
    console.log('   ✅ Valid XML format');
  } else {
    console.log('   ❌ Invalid XML format');
  }
  
  if (xml.includes('<urlset')) {
    console.log('   ✅ Contains urlset');
  } else {
    console.log('   ❌ Missing urlset');
  }
  
  if (xml.includes('<url>')) {
    console.log('   ✅ Contains URLs');
  } else {
    console.log('   ❌ No URLs found');
  }
}

// Check robots.txt
function checkRobots(robots) {
  console.log('   📊 Robots.txt Check:');
  
  if (robots.includes('User-agent:')) {
    console.log('   ✅ Contains User-agent directive');
  } else {
    console.log('   ❌ Missing User-agent directive');
  }
  
  if (robots.includes('Sitemap:')) {
    console.log('   ✅ Contains Sitemap directive');
  } else {
    console.log('   ❌ Missing Sitemap directive');
  }
  
  if (robots.includes('Disallow:')) {
    console.log('   ✅ Contains Disallow directives');
  } else {
    console.log('   ❌ Missing Disallow directives');
  }
}

// Run all tests
async function runTests() {
  try {
    console.log('🚀 Starting SEO Tests...\n');
    
    await testEndpoint('/', 'Home Page SEO');
    await testEndpoint('/blog', 'Blog Page SEO');
    await testEndpoint('/academy', 'Academy Page SEO');
    await testEndpoint('/docs', 'Docs Page SEO');
    await testEndpoint('/sitemap.xml', 'Sitemap Generation');
    await testEndpoint('/robots.txt', 'Robots.txt Configuration');
    
    console.log('🎉 SEO Testing Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Right-click → Inspect Element → Check <head> section');
    console.log('3. Look for meta tags, Open Graph, and structured data');
    console.log('4. Test mobile responsiveness (F12 → Device toggle)');
    console.log('5. Run Lighthouse audit (F12 → Lighthouse tab)');
    
  } catch (error) {
    console.log('❌ Testing failed. Make sure the development server is running:');
    console.log('   npm run dev');
  }
}

runTests();
