import { Request, Response } from 'express';
import { CallService } from './service';

const callService = new CallService();

export const getCallsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)){
      return res.status(400).json({ error: "Invalid userId" });
    }

    const { byName, byPhone } = req.query;
    
    const calls = await callService.getCallsByUserId({
      userId,
      byName: byName as string,
      byPhone: byPhone as string,
    });
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
};

export const getCallById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const call = await callService.getCallById(Number(id));
    if (!call) return res.status(404).json({ error: 'Call not found' });
    res.status(200).json(call);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch call' });
  }
};

export const createCall = async (req: Request, res: Response) => {
  try {
    const call = req.body;
    const newCall = await callService.createCall(call);
    res.status(201).json(newCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create call' });
  }
};

export const updateCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const call = req.body;
    const updatedCall = await callService.updateCall(Number(id), call);
    res.status(200).json(updatedCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update call' });
  }
};

export const deleteCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await callService.deleteCall(Number(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete call' });
  }
};
