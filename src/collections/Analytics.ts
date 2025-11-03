import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

/**
 * Analytics Collection
 * 
 * Comprehensive analytics tracking for articles, posts, and user interactions.
 * This collection stores detailed metrics including page views, user engagement,
 * time spent on content, device information, geographic data, and more.
 * 
 * ## Key Features:
 * - Article/Post view tracking with unique user identification
 * - Session-based analytics with device and browser information
 * - Geographic tracking (country, city, region)
 * - Engagement metrics (time spent, scroll depth, interactions)
 * - Referrer and traffic source tracking
 * - Real-time data aggregation support
 * 
 * ## Access Control:
 * - Read: Authenticated users only (admins, editors)
 * - Create: Public API access (for tracking events from frontend)
 * - Update/Delete: Authenticated users only
 * 
 * ## Use Cases:
 * - Track article performance and popularity
 * - Analyze user behavior and engagement patterns
 * - Generate content performance reports
 * - Identify trending topics and high-performing content
 * - Monitor traffic sources and referrals
 */
export const Analytics: CollectionConfig = {
  slug: 'analytics',
  
  admin: {
    defaultColumns: ['contentType', 'contentId', 'eventType', 'createdAt'],
    useAsTitle: 'id',
    description: 'Analytics and tracking data for content performance and user engagement',
  },

  access: {
    // Public can create analytics events (tracked from frontend)
    create: () => true,
    // Only authenticated users can read/update/delete
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  fields: [
    // Content Reference
    {
      name: 'contentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Post', value: 'post' },
        { label: 'Media', value: 'media' },
        { label: 'Page', value: 'page' },
      ],
      admin: {
        description: 'Type of content being tracked',
      },
    },
    {
      name: 'contentId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'ID of the content item (article, post, etc.)',
      },
    },
    {
      name: 'contentTitle',
      type: 'text',
      admin: {
        description: 'Title of the content for easier reference',
        readOnly: true,
      },
    },

    // Event Information
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page View', value: 'page_view' },
        { label: 'Content Read', value: 'content_read' },
        { label: 'Video Play', value: 'video_play' },
        { label: 'Video Complete', value: 'video_complete' },
        { label: 'Share', value: 'share' },
        { label: 'Like', value: 'like' },
        { label: 'Comment', value: 'comment' },
        { label: 'Download', value: 'download' },
      ],
      admin: {
        description: 'Type of analytics event',
      },
    },

    // User Information
    {
      name: 'userId',
      type: 'text',
      index: true,
      admin: {
        description: 'Unique user identifier (anonymous or authenticated)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      index: true,
      admin: {
        description: 'Session identifier for grouping user activity',
      },
    },
    {
      name: 'isAuthenticated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user was logged in',
      },
    },

    // Device & Browser Information
    {
      name: 'deviceInfo',
      type: 'group',
      fields: [
        {
          name: 'deviceType',
          type: 'select',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'os',
          type: 'text',
          admin: {
            description: 'Operating system (e.g., iOS, Android, Windows)',
          },
        },
        {
          name: 'osVersion',
          type: 'text',
        },
        {
          name: 'browser',
          type: 'text',
          admin: {
            description: 'Browser name (e.g., Chrome, Safari, Firefox)',
          },
        },
        {
          name: 'browserVersion',
          type: 'text',
        },
        {
          name: 'screenResolution',
          type: 'text',
          admin: {
            description: 'Screen resolution (e.g., 1920x1080)',
          },
        },
      ],
    },

    // Geographic Information
    {
      name: 'geoLocation',
      type: 'group',
      fields: [
        {
          name: 'country',
          type: 'text',
          index: true,
        },
        {
          name: 'countryCode',
          type: 'text',
          admin: {
            description: 'ISO country code (e.g., US, BR, UK)',
          },
        },
        {
          name: 'region',
          type: 'text',
          admin: {
            description: 'State or region',
          },
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'latitude',
          type: 'number',
        },
        {
          name: 'longitude',
          type: 'number',
        },
      ],
    },

    // Engagement Metrics
    {
      name: 'engagementMetrics',
      type: 'group',
      fields: [
        {
          name: 'timeSpent',
          type: 'number',
          admin: {
            description: 'Time spent on content in seconds',
          },
        },
        {
          name: 'scrollDepth',
          type: 'number',
          admin: {
            description: 'Percentage of content scrolled (0-100)',
          },
        },
        {
          name: 'clickCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of clicks/interactions',
          },
        },
        {
          name: 'bounced',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'User left without interaction',
          },
        },
      ],
    },

    // Traffic Source
    {
      name: 'trafficSource',
      type: 'group',
      fields: [
        {
          name: 'referrer',
          type: 'text',
          admin: {
            description: 'Referring URL',
          },
        },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Direct', value: 'direct' },
            { label: 'Search', value: 'search' },
            { label: 'Social Media', value: 'social' },
            { label: 'Email', value: 'email' },
            { label: 'Referral', value: 'referral' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'medium',
          type: 'text',
          admin: {
            description: 'Marketing medium (e.g., cpc, organic, email)',
          },
        },
        {
          name: 'campaign',
          type: 'text',
          admin: {
            description: 'Campaign name for tracking',
          },
        },
        {
          name: 'utmParams',
          type: 'json',
          admin: {
            description: 'Full UTM parameters as JSON',
          },
        },
      ],
    },

    // Additional Metadata
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'User IP address (anonymized for privacy)',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Full user agent string',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional custom metadata as JSON',
      },
    },
  ],

  // Timestamps are automatically added by Payload
  timestamps: true,

  // Indexes for performance
  // Note: Additional database indexes should be created for:
  // - contentId + createdAt (for time-series queries)
  // - userId + createdAt (for user activity tracking)
  // - sessionId (for session analysis)
}
