import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from 'src/order/entities/order.entity';
import { InventoryManagement } from 'src/inventory-management/entities/inventory-management.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(InventoryManagement)
    private readonly inventoryRepository: Repository<InventoryManagement>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  //making delivery
  async makeDelivery(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    const { status } = updateDeliveryDto;

    const order = await this.orderRepository.findOne({
      where: { orderId: id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (status === OrderStatus.Completed) {
      order.orderStatus = status;
      await this.orderRepository.save(order);

      //deduce the quantity in the inventoy managemnt

      const orderItems = await this.orderItemRepository.find({
        where: { orderId: id },
      });
      for (const item of orderItems) {
        const inventoryItem = await this.inventoryRepository.findOne({
          where: { productId: item.productId },
        });
        if (inventoryItem) {
          inventoryItem.productQuantity -= item.quantity;
          await this.inventoryRepository.save(inventoryItem);
        }
      }

      return `Order #${id} status updated to ${status}`;
    } else {
      throw new BadRequestException('Invalid status provided');
    }
  }

  findAll() {
    return `This action returns all delivery`;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { orderId: id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  //returned delivery
  async returnedDelivery(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    const { status } = updateDeliveryDto;

    const order = await this.orderRepository.findOne({
      where: { orderId: id },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (status === OrderStatus.Returned) {
      order.orderStatus = status;
      await this.orderRepository.save(order);
      return `Order #${id} status updated to ${status}`;
    } else {
      throw new BadRequestException('Invalid status provided');
    }
  }
}