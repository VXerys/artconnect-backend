import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

// Helper for Pagination
const getPagination = (page: number, limit: number, total: number) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

// Get All Contacts
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const { type, status } = req.query;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    const whereClause: Prisma.ContactWhereInput = {
      userId: user.id
    };

    if (type) whereClause.type = type as any;
    if (status) whereClause.status = status as any;

    const total = await prisma.contact.count({ where: whereClause });
    const contacts = await prisma.contact.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: getPagination(page, limit, total)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Create Contact
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, type, notes, tags } = req.body;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    if (!name || !type) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed: name and type are required' }
      });
      return;
    }

    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        company,
        type, // Enum validation handled by Prisma or catch block
        notes,
        tags: tags, // Json
        userId: user.id,
        status: 'ACTIVE'
      }
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        type: 'CONTACT_CREATED',
        title: `Created contact: ${name}`,
        userId: user.id,
        contactId: newContact.id
      }
    });

    res.status(201).json({
      success: true,
      data: newContact,
      message: 'Contact created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Internal Server Error' }
    });
  }
};

// Update Contact
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
       res.status(404).json({ success: false, error: { message: 'User not found' } });
       return;
    }

    const existingContact = await prisma.contact.findUnique({ where: { id } });
    if (!existingContact) {
      res.status(404).json({ success: false, error: { message: 'Contact not found' } });
      return;
    }

    if (existingContact.userId !== user.id) {
      res.status(403).json({ success: false, error: { message: 'Permission denied' } });
      return;
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { ...data }
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        type: 'CONTACT_UPDATED',
        title: `Updated contact: ${updatedContact.name}`,
        userId: user.id,
        contactId: updatedContact.id
      }
    });

    res.status(200).json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

// Delete Contact
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
       res.status(404).json({ success: false, error: { message: 'User not found' } });
       return;
    }

    const existingContact = await prisma.contact.findUnique({ where: { id } });
    if (!existingContact) {
      res.status(404).json({ success: false, error: { message: 'Contact not found' } });
      return;
    }

    if (existingContact.userId !== user.id) {
      res.status(403).json({ success: false, error: { message: 'Permission denied' } });
      return;
    }

    await prisma.contact.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};
