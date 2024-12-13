import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export const createInitialUser = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  
  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      username: 'admin',
      password: hashedPassword,
    });
    
    await userRepository.save(adminUser);
    console.log('Initial admin user created');
  }
};
