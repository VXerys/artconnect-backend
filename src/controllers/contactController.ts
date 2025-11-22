import { Request, Response } from 'express';
import * as contactService from '../services/contactService';
import { ApiResponse, PaginatedResponse } from '../types';
import { Contact } from '@prisma/client';

const getPagination = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { type, status, search, sortBy, sortOrder } = req.query;
    const userId = req.user?.uid!;

    const result = await contactService.getContacts({
      userId,
      page,
      limit,
      type: type as string,
      status: status as string,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    const response: ApiResponse<PaginatedResponse<Contact>> = {
      success: true,
      data: {
        data: result.contacts,
        pagination: getPagination(page, limit, result.total),
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' },
    });
  }
};

export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);

    if (!contact) {
      res.status(404).json({ success: false, error: { message: 'Contact not found' } });
      return;
    }

    // Simple permission check
    if (contact.userId !== req.user?.uid) {
        res.status(403).json({ success: false, error: { message: 'Permission denied' } });
        return;
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' },
    });
  }
};

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid!;
    const newContact = await contactService.createContact({
      ...req.body,
      userId,
    });

    res.status(201).json({
      success: true,
      data: newContact,
      message: 'Contact created successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' },
    });
  }
};

export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid!;

    const updatedContact = await contactService.updateContact(id, userId, req.body);

    res.status(200).json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully',
    });
  } catch (error: any) {
    if (error.message === 'Contact not found') {
      res.status(404).json({ success: false, error: { message: error.message } });
    } else if (error.message === 'Permission denied') {
      res.status(403).json({ success: false, error: { message: error.message } });
    } else {
      res.status(500).json({ success: false, error: { message: error.message || 'Internal Server Error' } });
    }
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid!;

    await contactService.deleteContact(id, userId);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error: any) {
     if (error.message === 'Contact not found') {
      res.status(404).json({ success: false, error: { message: error.message } });
    } else if (error.message === 'Permission denied') {
      res.status(403).json({ success: false, error: { message: error.message } });
    } else {
      res.status(500).json({ success: false, error: { message: error.message || 'Internal Server Error' } });
    }
  }
};
