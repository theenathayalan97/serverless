const AWS = require('aws-sdk');
const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');
const tableName=require('../constant/dbTablesName')
// Set up AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
  debug: true
});
dynamoose.aws.sdk = AWS


// Define the schema for the table
const userSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),
      hashKey: true,
      unique: true,

    },
    first_name: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      }, message: 'Email must be a valid email address'
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      rangeKey:true
    },
    password: {
      type: String,
      required: true,
      exclude: true, // Exclude the password attribute from query results
    },

    verified: {
      type: Boolean,
    },
    is_active: {
      type: Boolean,
    },
    is_delete: {
      type: Boolean,
    },
    is_active: {
      type: Boolean,
    },
    last_login: {
      type: String,
    },
    submitted: {
      type: Boolean,
    },
    resubmitted: {
      type: Boolean,
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
    role: {
      type: String,
      require: true
    },
    tenant_id: {
      type: String,
      hashKey:true
    },
  },
  {
    timeStamps: true
  }
);
//role master schema
const roleMaster = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),
      hashKey: true,
      unique: true
    },
    role_name: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,

    },
    is_deleted: {
      type: Boolean,

    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
  },
  {
    consistentRead: true,
    timeStamps: true
  }
);

//profile schema
const profileSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),

    },
    otp: {
      type: String,
    },
    is_active: {
      type: Boolean,
    },
    is_deleted: {
      type: Boolean,
    },
    marital_status: {
      type: String
    },
    dob: {
      type: String
    },
    emergency_contact: {
      type: String
    },
    Profile_photo: {
      type: String
    },
    gender: {
      type: String
    },
    language: {
      type: String
    },
    age: {
      type: Number
    },
    user_id: {
      type: String,
      hashKey: true,


    },
    tenant_id: {
      type: String
    },
    updated_by: {
      type: String
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);
const addressSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      hashKey: true,
      default: uuidv4()
    },
    address_type: { //m
      type: String,
    },
    address1: { //m
      type: String,
    },
    address2: {
      type: String,
    },
    city: {//m
      type: String,
    },
    state: {//m
      type: String,
    },
    country: {//m
      type: String,
    },
    zip_code: {//m
      type: String,
    },
    mobile_number: {
      type: String,
    },
    email: {
      type: String,
    },
    set_default: {//m
      type: Boolean,
    },
    remarks: {
      type: String,
    },
    is_active: {
      type: Boolean,
    },
    is_deleted: {
      type: Boolean,
    },

    //foreign key
    user_id: {
      type: String,
    },
    tenant_id: {
      type: String,
    },
    created_by: {
      type: String
    },
    updated_by: {
      type: String,
    },
  },

  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);
const addressMasterSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      hashKey: true,
      default: uuidv4()
    },
    place: {
      type: String,
    },
    sub_district: {
      type: String,
    },
    district: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    primary_address: {
      type: String,
    },
    is_active: {
      type: Boolean,
    },
    is_deleted: {
      type: Boolean,
    },
  },

  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);
const tenantAuditSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),
      hashKey: true,
    },
    name: {
      type: String,
    },
    domain: {
      type: Array,
      // "schema": [String],
    },
    is_deleted: {
      type: Boolean,
    },
    //foreign key
    super_admin_id: {
      type: String
    },
    created_by: {
      type: String
    },
    updated_by: {
      type: String
    },
  },

  {
    saveUnknown: true,
    timestamps: true, // Add createdAt and updatedAt fields
  }
);
const availableSchema = new dynamoose.Schema({
  uuid: {
    type: String, hashKey: false, default: uuidv4()
  },
  start_Date: {
    type: String
  },
  end_Date: {
    type: String
  },//"10:30"
  schedule_starttime: {
    type: String
  }, schedule_endtime: {
    type: String
  },//"10:00"
  repeat_availability: {
    type: Boolean,
  },
  day_of_week: {
    type: String
  },
  is_active: {
    type: Boolean
  },
  is_deleted: {
    type: Boolean
  },
  //foreign key
  created_by: {
    type: String
  },
  updated_by: {
    type: String
  },
  provider_id: {
    type: String
  },
},
  {
    timeStamps: false
  })

const signatureSchema = new dynamoose.Schema({
  uuid: {
    type: String, hashKey: true, default: uuidv4()
  },
  is_deleted: {
    type: Boolean, required: true
  },
  signature: {
    type: String, required: true
  },
  //foreign key
  tenant_id: {
    type: String, required: true
  },
  created_by: {
    type: String, required: true
  },
  updated_by: {
    type: String, required: true
  },
},
  {
    timeStamps: true
  })

const providerProfileSchema = new dynamoose.Schema({
  uuid:
    { type: String, default: uuidv4(), hashKey: true, },
  name: {
    type: String, required: false, unique: true
  },
  description: {
    type: String, required: false
  },
  profile_view: {
    type: String, required: false
  },
  answer_document_name: {
    type: String, required: false
  },
  questions_document_name: {
    type: Boolean, required: false
  },
  doctype: {
    type: Boolean, required: false
  },
  channels: {
    type: String, required: false
  },
  updated_required: {
    type: Boolean, required: false
  },
  is_deleted: {
    type: Boolean, required: false
  },
  default_required: {
    type: Boolean, required: false
  },
  mandatory: {
    type: Boolean, required: false
  },
  //foreign key
  created_by: {
    type: String, required: false
  },
  updated_by: {
    type: String, required: false
  },
  attachment_required: {
    type: Boolean, required: false
  },
},
  {
    timeStamps: true
  })
const providersProviderSchema = new dynamoose.Schema({
  uuid:
  {
    type: String,
    default: uuidv4(),
    hashKey: true
  },
  details: {
    type: Object,

  },
  set_default: {
    type: Boolean, required: false
  },
  created_by: {
    type: String, required: false
  },
  updated_by: {
    type: String, required: false
  },
  profile_name: {
    type: String, required: false,
  },
  // foreign key
  provider_id: {
    type: String, required: false
  },
  tenant_id: {
    type: String, required: false
  }
},
  {
    timeStamps: true,
    saveUnknown: true
  })

const specialtySchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),
      hashKey: true,
    },
    name: {
      type: String,
    },
    is_active: {
      type: Boolean,
    },
    is_deleted: {
      type: Boolean,
    },
    specialty_id: {
      type: String
    },
    user_id: {
      type: String,
    },
    tenant_id: {
      type: String,
    },
    created_by: {
      type: String
    },
    updated_by: {
      type: String
    },
  },

  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);
const specialtyMasterSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),
      hashKey: true,
    },
    name: {
      type: String,
    },
    is_active: {
      type: Boolean,
    },
    is_deleted: {
      type: Boolean,
    },

    tenant_id: {
      type: String,
    },
    user_id: {
      type: String,
    },
    created_by: {
      type: String
    },
    updated_by: {
      type: String
    },
  },

  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

const vitalsSchema = new dynamoose.Schema({
  uuid:
    { type: String, hashKey: true, default: uuidv4 },
  blood_pressure_systolic:
    { type: String, required: true },
  blood_pressure_diastolic:
    { type: String, required: true },
  height:
    { type: String, required: true },
  weight:
    { type: String, required: true },
  temperature:
    { type: String, required: true },
  pulse_rate:
    { type: String, required: true },
  bmi:
    { type: String, required: true },
  waist_circumference:
    { type: String, required: false },
  triglycerides:
    { type: String, required: false },
  fast_blood_glucose:
    { type: String, required: false },
  SPO2:
    { type: String, required: false },
  is_active:
    { type: String, required: false },
  is_deleted:
    { type: String, required: false }

}, {
  timeStamps: true
})

const tenantSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),
      hashKey: true,
    },
    name: {
      type: String,
      
    },
    domain: {
      type: Array,
    },
    is_deleted: {
      type: Boolean,
    },
    is_active: {
      type: Boolean,
    },
    //foreign key
    super_admin_id: {
      type: String
    },
    created_by: {
      type: String
    },
    updated_by: {
      type: String
    },
  },

  {
    saveUnknown: true,
    timestamps: true, // Add createdAt and updatedAt fields
  }
)
const tenantProfileSchema = new dynamoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4(),
      hashKey: true,
    },
    //tenant id 
    tenant_id: {
      type: String
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    address3: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zip_code: {
      type: String,
    },
    mobile_number: {
      type: String,
    },
    email: {
      type: String,
    },
    remarks: {
      type: String,
    },
    logo: {
      type: String
    },
    administrative_policies: {
      type: String
    },
    branch: {
      type: String
    },
    branch_code: {
      type: String
    },
    fax_number: {
      type: String
    },
    founder: {
      type: String
    },
    founding_date: {
      type: String
    },
    found_location: {
      type: String
    },
    geo_lat: {
      type: String
    },
    geo_lng: {
      type: String
    },
    human_resource_management_policies: {
      type: String
    },
    information_management_policies: {
      type: String
    },
    legal_name: {
      type: String
    },
    medicine_policies: {
      type: String
    },
    no_of_employees: {
      type: String
    },
    providing_care_policies: {
      type: String
    },
    tax_id: {
      type: String
    },
    updated_by: {
      type: String
    },
  },

  {
    saveUnknown: true,
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

const User = dynamoose.model(tableName.users, userSchema);
const role = dynamoose.model(tableName.roleMaster, roleMaster);
const profile = dynamoose.model(tableName.profile, profileSchema);
const address = dynamoose.model(tableName.address, addressSchema);
const addressMaster = dynamoose.model(tableName.addressMaster, addressMasterSchema);
const tenantAudit = dynamoose.model(tableName.tenantAudit, tenantAuditSchema);
const available = dynamoose.model(tableName.available, availableSchema);
const signature = dynamoose.model(tableName.signature, signatureSchema);
const providerProfile = dynamoose.model(tableName.providerProfiles, providerProfileSchema);
const providersProvider = dynamoose.model('providersProvider', providersProviderSchema);
const specialty = dynamoose.model(tableName.specialty, specialtySchema);
const specialtyMaster = dynamoose.model(tableName.specialtyMaster, specialtyMasterSchema);
const vitals = dynamoose.model(tableName.vitals, vitalsSchema);
const tenant = dynamoose.model(tableName.tenant, tenantSchema);
const tenantProfile = dynamoose.model(tableName.tenantProfile, tenantProfileSchema);

(async () => {
  await User.scan().exec();
  await role.scan().exec();
  await profile.scan().exec();
  await address.scan().exec();
  await addressMaster.scan().exec();
  await tenantAudit.scan().exec();
  await available.scan().exec();
  await signature.scan().exec();
  await providerProfile.scan().exec();
  await providersProvider.scan().exec();
  await specialtyMaster.scan().exec();
  await specialty.scan().exec();
  await tenant.scan().exec();
  await vitals.scan().exec();
  await tenantProfile.scan().exec();
})();


