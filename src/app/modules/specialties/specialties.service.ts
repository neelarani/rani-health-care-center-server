import { Request } from 'express';
import { Specialties } from '@prisma/client';
import { fileUploader, prisma } from '@/shared';

export const insertIntoDB = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  if (req.body.data) {
    const parsedData = JSON.parse(req.body.data);
    req.body = { ...req.body, ...parsedData };
    delete req.body.data;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

export const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

export const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};
