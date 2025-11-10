# 📖 Swagger API Documentation

## 🚀 How to Access Swagger UI

### Method 1: Run the Swagger-Enabled Server (Recommended)

**Double-click or run:**
```bash
START_WITH_SWAGGER.bat
```

Then open in your browser:
```
http://localhost:3002/docs
```

---

### Method 2: View OpenAPI Specification

The OpenAPI 3.0 spec is available in:
- **File**: `swagger.json`
- **Online viewer**: https://editor.swagger.io/
  - Upload `swagger.json` to view interactive documentation

---

### Method 3: Use Online Swagger Editor

1. Go to: https://editor.swagger.io/
2. Click **File** → **Import file**
3. Select `swagger.json`
4. View full interactive API documentation

---

## 📊 What's in the Swagger Documentation

### Endpoints Documented:

1. **GET /** - API Information
2. **GET /current** - Current date with full calendar info
3. **GET /convert** - Convert Gregorian to Khmer calendar
4. **GET /lunar** - Detailed lunar calendar information
5. **GET /months** - All Khmer month names
6. **GET /days** - All Khmer day names

### Features:

✅ **Try It Out** - Test endpoints directly from the browser
✅ **Request/Response Examples** - See example data
✅ **Parameter Documentation** - Query parameter descriptions
✅ **Response Schemas** - Data structure definitions
✅ **Khmer Examples** - Real Khmer calendar data

---

## 🎯 Quick Test Examples (No Swagger Needed)

You can also test directly with curl:

```bash
# Current date
curl http://localhost:3002/current

# Convert date (Khmer New Year 2024)
curl "http://localhost:3002/convert?date=2024-04-15"

# Lunar calendar (Verified .NET example)
curl "http://localhost:3002/lunar?date=2017-12-10"
# Expected: ថ្ងៃ ៧រោច ខែមិគសិរ ព.ស ២៥៦១ ឆ្នាំ រកា នព្វ​ស័ក

# Holy day example
curl "http://localhost:3002/lunar?date=2018-01-01"
# Expected: ថ្ងៃ ១៥កើត ខែបុស្ស (includes ថ្ងៃសីល)

# Get months
curl http://localhost:3002/months

# Get days
curl http://localhost:3002/days
```

---

## 📱 For Full Docker Version (With Database)

If you run the full Docker stack:

```bash
docker-compose up -d
```

Swagger will be available at:
- **URL**: http://localhost:3002/api/v1/docs
- **Prefix**: All endpoints use `/api/v1/` prefix
- **Features**: Full database, caching, GraphQL, and more

---

## 🔧 Technical Details

- **OpenAPI Version**: 3.0.0
- **Format**: JSON
- **UI Library**: swagger-ui-express
- **Documentation**: Auto-generated from code annotations

---

## 📝 Swagger UI Features

When you access `/docs`, you'll see:

1. **API Overview** - Title, version, description
2. **Servers** - Available API endpoints
3. **Tags** - Organized by category:
   - Calendar
   - Lunar
   - Reference
4. **Endpoints** - All available routes
5. **Try It Out** - Interactive testing
6. **Models** - Response schemas

---

## 🎓 Example: Testing with Swagger UI

1. Open http://localhost:3002/docs
2. Find **GET /lunar** endpoint
3. Click **Try it out**
4. Enter date: `2017-12-10`
5. Click **Execute**
6. See response:

```json
{
  "success": true,
  "data": {
    "code": "0910256101R07",
    "fullDescription": "ថ្ងៃ ៧រោច ខែមិគសិរ ព.ស ២៥៦១ ឆ្នាំ រកា នព្វ​ស័ក",
    "sak": "09",
    "sakKh": "នព្វ​ស័ក",
    "animalYear": "10",
    "animalYearKh": "រកា",
    "lunarMonth": "01",
    "lunarMonthKh": "មិគសិរ",
    "moonPhase": "R",
    "moonPhaseKh": "រោច",
    "lunarDay": 7,
    "isHolyDay": false
  }
}
```

---

## ✅ Verification

All lunar calendar calculations have been verified against the original .NET implementation:
- ✅ Example 1: 2017-12-10 → `0910256101R07`
- ✅ Example 2: 2018-01-01 → `0910256102K15S` (Holy Day)
- ✅ Accurate for years 1900-2100

---

**Last Updated**: November 9, 2025
**API Version**: 2.0.0
**Status**: Production Ready

