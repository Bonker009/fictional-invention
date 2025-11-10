import { Router } from 'express';
import { CalendarController } from '../../../presentation/controllers/CalendarController';

export const createCalendarRoutes = (controller: CalendarController): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/v1/current:
   *   get:
   *     summary: Get current date in Khmer calendar format
   *     tags: [Calendar]
   *     responses:
   *       200:
   *         description: Current date with Khmer calendar information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   */
  router.get('/current', controller.getCurrentDate);

  /**
   * @swagger
   * /api/v1/convert:
   *   get:
   *     summary: Convert a date to Khmer calendar format
   *     tags: [Calendar]
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
   *         description: Converted date
   *   post:
   *     summary: Convert a date to Khmer calendar format (POST)
   *     tags: [Calendar]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - date
   *             properties:
   *               date:
   *                 type: string
   *                 format: date
   *     responses:
   *       200:
   *         description: Converted date
   */
  router.get('/convert', controller.convertDate);
  router.post('/convert', controller.convertDate);

  /**
   * @swagger
   * /api/v1/months:
   *   get:
   *     summary: Get all Khmer month names
   *     tags: [Calendar]
   *     responses:
   *       200:
   *         description: List of Khmer months
   */
  router.get('/months', controller.getMonths);

  /**
   * @swagger
   * /api/v1/days:
   *   get:
   *     summary: Get all Khmer day names
   *     tags: [Calendar]
   *     responses:
   *       200:
   *         description: List of Khmer days
   */
  router.get('/days', controller.getDays);

  /**
   * @swagger
   * /api/v1/buddhist-era/{year}:
   *   get:
   *     summary: Convert Gregorian year to Buddhist Era
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: year
   *         schema:
   *           type: integer
   *         required: true
   *         description: Gregorian year
   *     responses:
   *       200:
   *         description: Buddhist Era conversion
   */
  router.get('/buddhist-era/:year', controller.convertToBuddhistEra);

  /**
   * @swagger
   * /api/v1/gregorian/{beYear}:
   *   get:
   *     summary: Convert Buddhist Era year to Gregorian
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: beYear
   *         schema:
   *           type: integer
   *         required: true
   *         description: Buddhist Era year
   *     responses:
   *       200:
   *         description: Gregorian conversion
   */
  router.get('/gregorian/:beYear', controller.convertFromBuddhistEra);

  return router;
};

