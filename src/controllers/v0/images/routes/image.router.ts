import { Router, Request, Response } from 'express';
import { requireAuth } from '../../users/routes/auth.router';
import axios from "axios";
import { config } from '../../../../config/config';
import fs from "fs"

const router: Router = Router();
const c = config.dev;

router.get('', /* requireAuth, */ async (req: Request, res: Response) => {
  try {
    const image_url = req.query.url as string
    console.log(`Call to\n${c.image_proccessor_url}/filteredimage?image_url=${image_url}`);
    
    const result = await axios.get(`${c.image_proccessor_url}/filteredimage?image_url=${image_url}`, {responseType: "arraybuffer"})
    // const piece = image_url.split(".")    
    let buffer = Buffer.from(result.data,'binary').toString("base64");
    let image = `data:${result.headers["content-type"]};base64,${buffer}`;
    
    return res.status(200).json({data: `<img src="${image}"/>`})
    // return res.status(200).send(image)
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error })
  }
})

export const ImageRouter: Router = router;