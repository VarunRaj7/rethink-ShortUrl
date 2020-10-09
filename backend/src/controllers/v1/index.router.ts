import { Router, Request, Response } from 'express';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
);

const router: Router = Router();

// Get all feed items
router.get('/getShortUrl/', async (req: Request, res: Response) => {
  console.log(`${req.body.url}`);

  const id = nanoid();

  console.log(`${id}`);

  res.send(`${id}`);
});

export const IndexRouter: Router = router;
