import prisma from "../database/prismaClient";

export async function insertActivity({
	operation,
	entity,
	newValue,
	oldValue,
	idEntity,
	user,
	date,
}) {
	const activity = await prisma.activityRecord.create({
		data: {
			operation,
			entity,
			newValue,
			oldValue,
			idEntity: Number(idEntity),
			user,
			date,
		},
	});
	return activity;
}

export async function findAll({operationUpperCase,entityUpperCase,order}) {
	const activities = await prisma.activityRecord.findMany({
		where: { operation: operationUpperCase,
			entity: entityUpperCase},
		orderBy: {date:order},
	});
	
	return activities;
}
