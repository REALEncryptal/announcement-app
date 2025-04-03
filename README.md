# Announcement App

Fullstack announcement app built with Mantine, React.js, and MongoDB.
Made to help me learn fullstack development.

### Announcement Routes:

- GET /api/announcements - Get all announcements
- GET /api/announcements/:id - Get announcement by id
- POST /api/announcements - Create announcement
- PUT /api/announcements/:id - Update announcement
- DELETE /api/announcements/:id - Delete announcement

### Example announcement body:

```json
{
  "title": "Announcement Title",
  "content": "Announcement content",
  "tags": [
    {
      "type": "Tag Type",
      "color": "Tag Color"
    }
  ]
}
```