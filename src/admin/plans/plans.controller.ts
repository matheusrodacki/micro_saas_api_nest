import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PlanDto } from './dto/plan.dto';
import { CreatePlanDto } from './dto/create.plan.dto';
import { UpdatePlanDto } from './dto/update.plan.dto';
import { PlansService } from './plans.service';
import { PermissionsGuard } from 'src/roles/permissions.guard';
import { Permissions } from 'src/roles/permissions.decorator';

@ApiTags('Plans')
@Controller('plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // Create a plan
  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'The plan has been successfully created.',
    type: PlanDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Permissions('plan.create')
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanDto> {
    return await this.plansService.create(createPlanDto);
  }

  // Find all plans
  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({
    status: 200,
    description: 'Return all plans.',
    type: PlanDto,
  })
  @Permissions('plan.read')
  async findAll(): Promise<PlanDto[]> {
    return await this.plansService.findAll();
  }

  // Find one plan
  @Get(':id')
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the plan to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a plan by ID.',
    type: [PlanDto],
  })
  @Permissions('plan.read')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PlanDto> {
    return await this.plansService.findOne(id);
  }

  // Update a plan
  @Put(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiParam({
    name: 'id',
    description: 'ID of the plan',
  })
  @ApiResponse({
    status: 200,
    description: 'The plan has been successfully updated.',
    type: PlanDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Permissions('plan.update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanDto> {
    return await this.plansService.update(id, updatePlanDto);
  }

  // Delete a plan
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiParam({
    name: 'id',
    description: 'ID of the plan',
  })
  @ApiResponse({
    status: 200,
    description: 'The plan has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @Permissions('plan.delete')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.plansService.remove(id);
  }
}
