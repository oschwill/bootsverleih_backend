import Joi from 'joi';

export const boatSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  constructionYear: Joi.number().required(),
  serialNumber: Joi.string().alphanum().max(10).required(),
  material: Joi.string().required(),
  type: Joi.string().required(),
  imagePath: Joi.string().optional().allow(null),
});

export const validateData = (boat, res) => {
  const { error, value } = boatSchema.validate(boat);

  if (error) {
    console.log(error);
    res.status(418).json({ message: 'Validierung fehlgeschlagen ' + error.details[0].message });
    return null;
  }

  return value;
};
