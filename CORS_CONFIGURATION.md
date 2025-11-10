# CORS Configuration Guide

## ✅ CORS Issue Fixed!

The CORS error in production has been resolved. Here's what was changed and how to configure it for your environment.

---

## 🔧 What Was Fixed

1. **Problem**: The CORS configuration had `credentials: true` with `origin: '*'`, which is not allowed by browsers.
2. **Solution**: Updated CORS to use specific origins when `CORS_ORIGIN` is set, or allow all origins (without credentials) when not set.

---

## 📝 Configuration Options

### Option 1: Allow All Origins (Development/Public API)

**Don't set `CORS_ORIGIN` environment variable** - This allows all origins but disables credentials.

**Best for:**
- Public APIs
- Development/testing
- No authentication required

**Docker Compose:**
```yaml
environment:
  # Don't set CORS_ORIGIN or remove it
  - NODE_ENV=production
  - PORT=3002
```

---

### Option 2: Specific Origins (Production/Secure)

**Set `CORS_ORIGIN` with comma-separated list** - This allows only specific origins with credentials support.

**Best for:**
- Production environments
- APIs with authentication
- Restricted access

**Docker Compose:**
```yaml
environment:
  - CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

**Environment Variable:**
```bash
# Single origin
CORS_ORIGIN=https://yourdomain.com

# Multiple origins (comma-separated)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com

# Development + Production
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

---

## 🧪 Testing CORS

### Test with curl:

**1. Test allowed origin:**
```bash
curl -I -H "Origin: http://localhost:3000" http://localhost:3002/api/v1/health
```

**Expected headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

**2. Test OPTIONS preflight:**
```bash
curl -I -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  http://localhost:3002/api/v1/current
```

**Expected headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With,Accept
Access-Control-Max-Age: 86400
```

---

## 🌐 Production Deployment Examples

### Example 1: Single Production Domain

```yaml
environment:
  - CORS_ORIGIN=https://khmer-calendar.gov.kh
```

### Example 2: Multiple Subdomains

```yaml
environment:
  - CORS_ORIGIN=https://khmer-calendar.gov.kh,https://api.khmer-calendar.gov.kh,https://admin.khmer-calendar.gov.kh
```

### Example 3: Development + Production

```yaml
environment:
  - CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://khmer-calendar.gov.kh
```

### Example 4: With HTTPS and HTTP (Not Recommended)

```yaml
environment:
  - CORS_ORIGIN=http://khmer-calendar.gov.kh,https://khmer-calendar.gov.kh
```

---

## 🔒 Security Recommendations

### ✅ Do's:

1. **Use HTTPS in production:**
   ```
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Be specific with origins:**
   ```
   # Good
   CORS_ORIGIN=https://app.yourdomain.com,https://admin.yourdomain.com
   ```

3. **Include www and non-www if needed:**
   ```
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```

### ❌ Don'ts:

1. **Don't use wildcards in production:**
   ```bash
   # BAD - Don't do this
   CORS_ORIGIN=*.yourdomain.com
   ```

2. **Don't mix development and production carelessly:**
   ```bash
   # BAD - Remove localhost in production
   CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
   ```

3. **Don't leave it empty in production with sensitive data:**
   ```bash
   # BAD for sensitive APIs
   # CORS_ORIGIN not set = allows all origins
   ```

---

## 🚀 Apply Changes

After updating `docker-compose.yml`:

```bash
# Rebuild and restart
docker-compose build khmer-calendar-api
docker-compose up -d --force-recreate khmer-calendar-api

# Check logs
docker-compose logs -f khmer-calendar-api
```

---

## 🛠️ Current Configuration

**Default development origins (in docker-compose.yml):**
```
http://localhost:3000
http://localhost:3001
http://localhost:8080
```

**Update this list** in `docker-compose.yml` to match your frontend URLs!

---

## 📞 Troubleshooting

### Issue: Still getting CORS errors

1. **Check the Origin header in your request:**
   ```javascript
   // Frontend example
   fetch('http://localhost:3002/api/v1/current', {
     method: 'GET',
     credentials: 'include', // Important if using cookies
     headers: {
       'Content-Type': 'application/json',
     }
   });
   ```

2. **Verify the origin is in your CORS_ORIGIN list:**
   ```bash
   docker-compose exec khmer-calendar-api env | grep CORS
   ```

3. **Check browser console for exact error:**
   - "Origin is not allowed" → Add origin to CORS_ORIGIN
   - "credentials mode" → Make sure CORS_ORIGIN is set
   - "preflight" → Check OPTIONS request

4. **Clear browser cache and try again**

5. **Restart containers after config changes:**
   ```bash
   docker-compose restart khmer-calendar-api
   ```

---

## 📚 Additional Notes

- **Max Age**: Preflight requests are cached for 24 hours (86400 seconds)
- **Methods Allowed**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers Allowed**: Content-Type, Authorization, X-Requested-With, Accept
- **Credentials**: Enabled only when specific origins are configured

For more information about CORS, visit: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

