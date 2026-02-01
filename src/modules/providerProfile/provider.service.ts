import { prisma } from "../../lib/prisma";
import { ProviderProfile, UpdateProviderProfile } from "../../type/providerProfile.type";
import { User } from "../../type/user.type";

const createProviderProfile = async (data: ProviderProfile, user: User) => {
  // Implementation for creating provider profile

  const result = await prisma.providerProfile.create({
    data: {
      ...data,
      providerId: user.id,
    },
  });
  return result;
};

const getProviderProfile = async (user: User) => {
  const profile = await prisma.providerProfile.findFirst({
    where: {
      providerId: user.id,
    },
  });
  return profile;
};

const updateProviderProfile = async (
  data: UpdateProviderProfile,
  user: User,
) => {
  const profile = await prisma.providerProfile.update({
    where: {
      providerId: user.id,
    },
    data: {
      ...data,
    },
  });
  return profile;
};

export const providerProfileService = {
  createProviderProfile,
  getProviderProfile,
  updateProviderProfile,
};
