import Joi from 'joi';

export const boatSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  constructionYear: Joi.number().required(),
  serialNumber: Joi.string().alphanum().max(12).required(),
  material: Joi.string().required(),
  type: Joi.string().required(),
  imagePath: Joi.string().optional().allow(null),
});

export const userSchema = Joi.object({
  userName: Joi.string().min(5).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const validateData = (data, res, schema) => {
  const { error, value } = schema.validate(data);

  if (error) {
    console.log(error);
    res.status(418).json({ message: 'Validierung fehlgeschlagen ' + error.details[0].message });
    return null;
  }

  return value;
};
