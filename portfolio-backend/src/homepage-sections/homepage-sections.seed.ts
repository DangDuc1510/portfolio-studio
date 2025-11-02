import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomepageSection, HomepageSectionDocument } from './schemas/homepage-section.schema';

@Injectable()
export class HomepageSectionsSeed implements OnModuleInit {
  constructor(
    @InjectModel(HomepageSection.name)
    private homepageSectionModel: Model<HomepageSectionDocument>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultSections();
  }

  private async seedDefaultSections() {
    const defaultSections = [
      {
        sectionName: 'hero',
        isVisible: true,
        content: {
          title: 'Welcome to Portfolio Studio',
          subtitle: 'Capturing your precious moments with professional photography and videography services',
          backgroundImage: '',
          videoUrl: '',
          primaryButtonText: 'View Portfolio',
          primaryButtonLink: '/products',
          secondaryButtonText: 'Contact Us',
          secondaryButtonLink: '/contact',
        },
      },
      {
        sectionName: 'about',
        isVisible: true,
        content: {
          title: 'About Us',
          description: 'We are a professional photography and videography studio dedicated to capturing your most important moments. With years of experience and a passion for creativity, we deliver stunning results that tell your unique story.',
          image: '',
          stats: [
            { label: 'Years Experience', value: '10+' },
            { label: 'Projects Completed', value: '500+' },
            { label: 'Happy Clients', value: '1000+' },
          ],
        },
      },
      {
        sectionName: 'services',
        isVisible: true,
        content: {
          title: 'Our Services',
          subtitle: 'Comprehensive photography and videography solutions',
          services: [
            {
              icon: 'CameraOutlined',
              title: 'Photography',
              description: 'Professional photography services for weddings, events, portraits, and commercial projects',
            },
            {
              icon: 'VideoCameraOutlined',
              title: 'Videography',
              description: 'High-quality video production and editing for all your special occasions',
            },
            {
              icon: 'PictureOutlined',
              title: 'Photo Editing',
              description: 'Professional post-processing and retouching to make your images perfect',
            },
            {
              icon: 'CustomerServiceOutlined',
              title: 'Consultation',
              description: 'Expert advice and planning to ensure your vision comes to life',
            },
          ],
        },
      },
      {
        sectionName: 'testimonials',
        isVisible: true,
        content: {
          title: 'What Our Clients Say',
          testimonials: [],
        },
      },
    ];

    for (const section of defaultSections) {
      const existingSection = await this.homepageSectionModel.findOne({
        sectionName: section.sectionName,
      });

      if (!existingSection) {
        await this.homepageSectionModel.create(section);
        console.log(`✓ Seeded homepage section: ${section.sectionName}`);
      }
    }
  }
}

