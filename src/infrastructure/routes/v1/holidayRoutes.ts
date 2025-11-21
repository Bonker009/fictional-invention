import { Router } from 'express';
import { HolidayController } from '../../../presentation/controllers/HolidayController';

export const createHolidayRoutes = (controller: HolidayController): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/v1/holidays:
   *   get:
   *     summary: Get all holidays for a year
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Year (defaults to current year)
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [all, public, religious]
   *         description: Filter by holiday type
   *     responses:
   *       200:
   *         description: List of holidays
   */
  router.get('/', controller.getAllHolidays);

  /**
   * @swagger
   * /api/v1/holidays/date:
   *   get:
   *     summary: Get holidays for a specific date
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: Date in YYYY-MM-DD format
   *     responses:
   *       200:
   *         description: Holidays for the date
   */
  router.get('/date', controller.getHolidaysByDate);

  /**
   * @swagger
   * /api/v1/holidays/month:
   *   get:
   *     summary: Get holidays for a specific month
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Year (defaults to current year)
   *       - in: query
   *         name: month
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 12
   *         description: Month (defaults to current month)
   *     responses:
   *       200:
   *         description: Holidays for the month
   */
  router.get('/month', controller.getHolidaysByMonth);

  /**
   * @swagger
   * /api/v1/holidays/upcoming:
   *   get:
   *     summary: Get upcoming holidays
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Number of holidays to return (defaults to 10)
   *     responses:
   *       200:
   *         description: List of upcoming holidays
   */
  router.get('/upcoming', controller.getUpcomingHolidays);

  /**
   * @swagger
   * /api/v1/holidays/check:
   *   get:
   *     summary: Check if a date is a holiday
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: Date in YYYY-MM-DD format
   *     responses:
   *       200:
   *         description: Holiday check result
   */
  router.get('/check', controller.checkHoliday);

  /**
   * @swagger
   * /api/v1/holidays/public:
   *   get:
   *     summary: Get only public holidays
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Year (defaults to current year)
   *     responses:
   *       200:
   *         description: List of public holidays
   */
  router.get('/public', controller.getPublicHolidays);

  /**
   * @swagger
   * /api/v1/holidays/religious:
   *   get:
   *     summary: Get only religious holidays
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Year (defaults to current year)
   *     responses:
   *       200:
   *         description: List of religious holidays
   */
  router.get('/religious', controller.getReligiousHolidays);

  /**
   * @swagger
   * /api/v1/holidays/bulk:
   *   get:
   *     summary: Get holidays for a date range (bulk operation)
   *     tags: [Holidays]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: Start date in YYYY-MM-DD format
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: End date in YYYY-MM-DD format
   *     responses:
   *       200:
   *         description: List of holidays in date range
   */
  router.get('/bulk', controller.getBulkHolidays);

  /**
   * @swagger
   * /api/v1/holidays:
   *   post:
   *     summary: Create a new holiday
   *     tags: [Holidays]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - month
   *               - day
   *               - nameKh
   *               - nameEn
   *               - type
   *               - isPublicHoliday
   *             properties:
   *               month:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 12
   *                 description: Month (1-12)
   *               day:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 31
   *                 description: Day of month (1-31)
   *               nameKh:
   *                 type: string
   *                 description: Holiday name in Khmer
   *               nameEn:
   *                 type: string
   *                 description: Holiday name in English
   *               type:
   *                 type: string
   *                 enum: [public, religious, holy]
   *                 description: Type of holiday
   *               isPublicHoliday:
   *                 type: boolean
   *                 description: Whether it's a public holiday
   *               description:
   *                 type: string
   *                 description: Optional description of the holiday
   *               year:
   *                 type: integer
   *                 description: Optional year (if null, applies to all years)
   *     responses:
   *       201:
   *         description: Holiday created successfully
   *       400:
   *         description: Validation error
   */
  router.post('/', controller.createHoliday);

  return router;
};

