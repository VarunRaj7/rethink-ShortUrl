import { Router, Request, Response } from 'express';

const router: Router = Router();

// Get all feed items
router.get('getShortUrl/', async (req: Request, res: Response) => {
  console.log(`${req.body.url}`);
  res.send('Hello');
});

export const IndexRouter: Router = router;
