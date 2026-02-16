import { PrismaClient, Role, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Admin User
  const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL || 'admin@mydoctor.com'
  const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD || 'admin123'
  const demoAdminName = process.env.DEMO_ADMIN_NAME || 'Admin User'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: demoAdminEmail }
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(demoAdminPassword, 10)

    const admin = await prisma.user.create({
      data: {
        email: demoAdminEmail,
        name: demoAdminName,
        passwordHash,
        role: Role.ADMIN,
        phone: '+1234567890'
      }
    })

    console.log(`✓ Demo admin created successfully:`)
    console.log(`  Email: ${admin.email}`)
    console.log(`  Password: ${demoAdminPassword}`)
    console.log(`  Role: ${admin.role}`)
  } else {
    console.log(`✓ Admin user already exists: ${demoAdminEmail}`)
  }

  // Seed Sample Patients
  const patientCount = await prisma.patient.count()
  
  if (patientCount === 0) {
    console.log('\n🏥 Creating sample patients...')
    
    // Default password for all sample patients
    const patientPasswordHash = await bcrypt.hash('patient123', 10)
    
    const samplePatients = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        passwordHash: patientPasswordHash,
        phone: '+1 555-0101',
        dateOfBirth: new Date('1990-05-15'),
        gender: Gender.MALE,
        address: '123 Main St, New York, NY 10001',
        bloodType: 'A+',
        allergies: 'Penicillin',
        medicalHistory: 'Hypertension, managed with medication',
        insuranceProvider: 'Blue Cross Blue Shield',
        insuranceNumber: 'BC12345678',
        emergencyContactName: 'Jane Smith',
        emergencyContactPhone: '+1 555-0102',
        lastVisit: new Date('2024-01-15'),
        isActive: true
      },
      {
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.j@email.com',
        passwordHash: patientPasswordHash,
        phone: '+1 555-0201',
        dateOfBirth: new Date('1985-08-22'),
        gender: Gender.FEMALE,
        address: '456 Oak Ave, Los Angeles, CA 90001',
        bloodType: 'O-',
        allergies: 'None',
        medicalHistory: 'Type 2 Diabetes',
        insuranceProvider: 'Aetna',
        insuranceNumber: 'AE87654321',
        emergencyContactName: 'Robert Johnson',
        emergencyContactPhone: '+1 555-0202',
        lastVisit: new Date('2024-02-10'),
        isActive: true
      },
      {
        firstName: 'Michael',
        lastName: 'Williams',
        email: 'mwilliams@email.com',
        passwordHash: patientPasswordHash,
        phone: '+1 555-0301',
        dateOfBirth: new Date('1978-03-10'),
        gender: Gender.MALE,
        address: '789 Pine St, Chicago, IL 60601',
        bloodType: 'B+',
        allergies: 'Latex, Shellfish',
        medicalHistory: 'Asthma, uses inhaler as needed',
        insuranceProvider: 'United Healthcare',
        insuranceNumber: 'UH11223344',
        emergencyContactName: 'Sarah Williams',
        emergencyContactPhone: '+1 555-0302',
        lastVisit: new Date('2024-01-28'),
        isActive: true
      },
      {
        firstName: 'Sarah',
        lastName: 'Davis',
        email: 'sarah.davis@email.com',
        passwordHash: patientPasswordHash,
        phone: '+1 555-0401',
        dateOfBirth: new Date('1995-11-30'),
        gender: Gender.FEMALE,
        address: '321 Elm St, Houston, TX 77001',
        bloodType: 'AB+',
        allergies: null,
        medicalHistory: null,
        insuranceProvider: 'Cigna',
        insuranceNumber: 'CG99887766',
        emergencyContactName: 'David Davis',
        emergencyContactPhone: '+1 555-0402',
        lastVisit: null,
        isActive: true
      },
      {
        firstName: 'James',
        lastName: 'Brown',
        email: 'james.brown@email.com',
        passwordHash: patientPasswordHash,
        phone: '+1 555-0501',
        dateOfBirth: new Date('1982-07-18'),
        gender: Gender.MALE,
        address: '654 Maple Dr, Phoenix, AZ 85001',
        bloodType: 'O+',
        allergies: 'Pollen',
        medicalHistory: 'Seasonal allergies',
        insuranceProvider: 'Humana',
        insuranceNumber: 'HM55443322',
        emergencyContactName: 'Lisa Brown',
        emergencyContactPhone: '+1 555-0502',
        lastVisit: new Date('2024-02-05'),
        isActive: true
      }
    ]

    for (const patientData of samplePatients) {
      await prisma.patient.create({ data: patientData })
    }

    console.log(`✓ Created ${samplePatients.length} sample patients`)
  } else {
    console.log(`✓ Database already contains ${patientCount} patients`)
  }

  // Seed Sample Doctors
  const doctorCount = await prisma.doctor.count()
  
  if (doctorCount === 0) {
    console.log('\n👨‍⚕️ Creating sample doctors...')
    
    // Default password for all sample doctors
    const doctorPasswordHash = await bcrypt.hash('doctor123', 10)
    
    const sampleDoctors = [
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        specialization: 'Cardiology',
        licenseNumber: 'MD-12345',
        phone: '+1 555-1001',
        email: 'dr.sarah.johnson@mydoctor.com',
        passwordHash: doctorPasswordHash,
        address: '100 Medical Plaza, Suite 200, New York, NY 10001',
        department: 'Cardiovascular Medicine',
        availability: {
          mon: ['09:00', '17:00'],
          tue: ['09:00', '17:00'],
          wed: ['09:00', '17:00'],
          thu: ['09:00', '17:00'],
          fri: ['09:00', '15:00']
        },
        isActive: true
      },
      {
        firstName: 'Michael',
        lastName: 'Chen',
        specialization: 'Neurology',
        licenseNumber: 'MD-23456',
        phone: '+1 555-1002',
        email: 'dr.michael.chen@mydoctor.com',
        passwordHash: doctorPasswordHash,
        address: '100 Medical Plaza, Suite 301, New York, NY 10001',
        department: 'Neuroscience',
        availability: {
          mon: ['10:00', '18:00'],
          tue: ['10:00', '18:00'],
          wed: ['10:00', '18:00'],
          thu: ['10:00', '18:00'],
          fri: ['10:00', '16:00']
        },
        isActive: true
      },
      {
        firstName: 'Emily',
        lastName: 'Rodriguez',
        specialization: 'Pediatrics',
        licenseNumber: 'MD-34567',
        phone: '+1 555-1003',
        email: 'dr.emily.rodriguez@mydoctor.com',
        passwordHash: doctorPasswordHash,
        address: '100 Medical Plaza, Suite 150, New York, NY 10001',
        department: 'Pediatrics',
        availability: {
          mon: ['08:00', '16:00'],
          tue: ['08:00', '16:00'],
          wed: ['08:00', '16:00'],
          thu: ['08:00', '16:00'],
          fri: ['08:00', '14:00']
        },
        isActive: true
      },
      {
        firstName: 'David',
        lastName: 'Thompson',
        specialization: 'Orthopedics',
        licenseNumber: 'MD-45678',
        phone: '+1 555-1004',
        email: 'dr.david.thompson@mydoctor.com',
        passwordHash: doctorPasswordHash,
        address: '100 Medical Plaza, Suite 400, New York, NY 10001',
        department: 'Orthopedic Surgery',
        availability: {
          mon: ['09:00', '17:00'],
          wed: ['09:00', '17:00'],
          thu: ['09:00', '17:00'],
          fri: ['09:00', '17:00']
        },
        isActive: true
      },
      {
        firstName: 'Jennifer',
        lastName: 'Lee',
        specialization: 'Dermatology',
        licenseNumber: 'MD-56789',
        phone: '+1 555-1005',
        email: 'dr.jennifer.lee@mydoctor.com',
        passwordHash: doctorPasswordHash,
        address: '100 Medical Plaza, Suite 250, New York, NY 10001',
        department: 'Dermatology',
        availability: {
          mon: ['10:00', '18:00'],
          tue: ['10:00', '18:00'],
          thu: ['10:00', '18:00'],
          fri: ['10:00', '18:00']
        },
        isActive: true
      },
      {
        firstName: 'Robert',
        lastName: 'Williams',
        specialization: 'Internal Medicine',
        licenseNumber: 'MD-67890',
        phone: '+1 555-1006',
        email: 'dr.robert.williams@mydoctor.com',
        passwordHash: doctorPasswordHash,
        address: '100 Medical Plaza, Suite 180, New York, NY 10001',
        department: 'Internal Medicine',
        availability: {
          mon: ['08:00', '16:00'],
          tue: ['08:00', '16:00'],
          wed: ['08:00', '16:00'],
          thu: ['08:00', '16:00'],
          fri: ['08:00', '14:00']
        },
        isActive: true
      }
    ]

    for (const doctorData of sampleDoctors) {
      await prisma.doctor.create({ data: doctorData })
    }

    console.log(`✓ Created ${sampleDoctors.length} sample doctors`)
  } else {
    console.log(`✓ Database already contains ${doctorCount} doctors`)
  }

  console.log('\n✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
