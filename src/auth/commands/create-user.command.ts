import { Command, CommandRunner } from 'nest-commander';
import { AuthService } from '../auth.service';

@Command({ name: 'create-user', description: 'Create a new user' })
export class CreateUserCommand extends CommandRunner {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [username, password] = passedParams;
    if (!username || !password) {
      console.error('Please provide both username and password');
      return;
    }

    try {
      const user = await this.authService.createUser(username, password);
      console.log('User created successfully:', user);
    } catch (error) {
      console.error('Failed to create user:', error.message);
    }
  }
}
