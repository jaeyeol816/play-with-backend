import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	res.status(201).json({
		code: 201,
		message: "temp",
	});
}