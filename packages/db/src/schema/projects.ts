import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import {
  // bigint,
  boolean,
  check,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const projects = pgTable(
  "projects",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => "projects_" + randomUUID()),
    title: text("title").notNull().default("Untitled Project"),
    description: text("description").notNull().default(""),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isPublic: boolean("is_public").default(false),
    isTemplate: boolean("is_template").default(false),
    // folderId: text("folder_id").references(() => folders.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
    revisionCount: integer("revision_count").default(0),
    isDeleted: boolean("is_deleted").default(false),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    pgPolicy("Users can view own projects", {
      as: "permissive",
      to: "current_user",
      for: "select",
      using: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can create own projects", {
      as: "permissive",
      to: "current_user",
      for: "insert",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can update own projects", {
      as: "permissive",
      to: "current_user",
      for: "update",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can delete own projects", {
      as: "permissive",
      to: "current_user",
      for: "delete",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
  ]
).enableRLS();

export const projectsOrientation = pgTable(
  "projects_orientation",
  {
    projectId: text("id")
      .primaryKey()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    width: integer("width").notNull().default(1920),
    height: integer("height").notNull().default(1080),
    fps: integer("fps").notNull().default(30),
    durationInSeconds: integer("duration_in_seconds").notNull().default(0),
  },
  (table) => [
    unique().on(table.projectId, table.userId),
    pgPolicy("Users can view own projects orientation", {
      as: "permissive",
      to: "current_user",
      for: "select",
      using: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can create own projects orientation", {
      as: "permissive",
      to: "current_user",
      for: "insert",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can update own projects orientation", {
      as: "permissive",
      to: "current_user",
      for: "update",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can delete own projects orientation", {
      as: "permissive",
      to: "current_user",
      for: "delete",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
  ]
).enableRLS();

// export const themes = pgTable("themes", {
//   id: text("id")
//     .primaryKey()
//     .default("themes_" + randomUUID()),
//   name: text("name").notNull().default("Untitled Theme"),
//   description: text("description").notNull().default(""),
//   userId: text("user_id").references(() => users.id, {
//     onDelete: "cascade",
//   }),
//   isPublic: boolean("is_public").default(false),
//   // defaultBackgroundType: varchar("default_background_type", {
//   //   length: 50,
//   // }).default("solid"),
//   // defaultBackgroundColor: varchar("default_background_color", {
//   //   length: 7,
//   // }).default("#FFFFFF"),
//   // defaultFontFamily: varchar("default_font_family", { length: 100 }).default(
//   //   "Arial"
//   // ),
//   // defaultTextColor: varchar("default_text_color", { length: 7 }).default(
//   //   "#000000"
//   // ),
//   themeData: jsonb("theme_data").default({}),
//   usageCount: integer("usage_count").default(0),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// }).enableRLS();

// export const folders = pgTable("folders", {
//   id: text("id")
//     .primaryKey()
//     .default("folders_" + randomUUID()),
//   name: varchar("name", { length: 255 }).notNull(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   parentFolderId: text("parent_folder_id").references(() => folders.id, {
//     onDelete: "set null",
//   }),
//   color: varchar("color", { length: 7 }).default("#1a73e8"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// }).enableRLS();

export const scenes = pgTable(
  "scenes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => "scenes_" + randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    sceneNumber: integer("scene_number").notNull(),
    // title: text("title").notNull().default("Untitled Scene"),
    // notes: text("notes").notNull().default(""),
    // // layoutType: varchar("layout_type", { length: 100 }).default("blank"),
    durationInSeconds: integer("duration_in_seconds").notNull().default(5),
    // backgroundType: varchar("background_type", { length: 50 })
    //   .notNull()
    //   .default("solid"),
    // backgroundColor: varchar("background_color", { length: 7 }),
    // backgroundGradientStart: varchar("background_gradient_start", {
    //   length: 7,
    // }),
    // backgroundGradientEnd: varchar("background_gradient_end", { length: 7 }),
    // backgroundGradientAngle: integer("background_gradient_angle").default(0),
    // backgroundImageUrl: text("background_image_url"),
    // backgroundImageFit: varchar("background_image_fit", { length: 20 }),
    // transitionType: varchar("transition_type", { length: 50 }).default("none"),
    // transitionDuration: integer("transition_duration").default(500),
    // isHidden: boolean("is_hidden").default(false),
    // isLocked: boolean("is_locked").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.projectId, table.sceneNumber),
    // check(
    //   "background_type_check",
    //   sql`${table.backgroundType} IN ('solid', 'gradient', 'image')`
    // ),
    // check(
    //   "background_image_fit",
    //   sql`${table.backgroundImageFit} IN (NULL, 'cover', 'contain', 'none')`
    // ),
    check("duration_in_seconds_check", sql`${table.durationInSeconds} > 0`),
    pgPolicy("Users can view own projects' scenes", {
      as: "permissive",
      to: "current_user",
      for: "select",
      using: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can create own projects' scenes", {
      as: "permissive",
      to: "current_user",
      for: "insert",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can update own projects' scenes", {
      as: "permissive",
      to: "current_user",
      for: "update",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can delete own projects' scenes", {
      as: "permissive",
      to: "current_user",
      for: "delete",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
  ]
).enableRLS();

export const sceneElements = pgTable(
  "scene_elements",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .default("scene_elements_" + randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sceneId: text("scene_id")
      .notNull()
      .references(() => scenes.id, { onDelete: "cascade" }),
    // tag: text("tag").notNull().default("div"),
    elementNumber: integer("element_number").notNull().default(0),
    // elementType: varchar("element_type", { length: 50 }).notNull(),
    // xPosition: decimal("x_position", { precision: 8, scale: 4 })
    //   .notNull()
    //   .default("0"),
    // yPosition: decimal("y_position", { precision: 8, scale: 4 })
    //   .notNull()
    //   .default("0"),
    // width: decimal("width", { precision: 8, scale: 4 }).notNull().default("10"),
    // height: decimal("height", { precision: 8, scale: 4 })
    //   .notNull()
    //   .default("10"),
    // rotation: decimal("rotation", { precision: 8, scale: 4 }).default("0"),
    // opacity: decimal("opacity", { precision: 3, scale: 2 }).default("1.0"),
    // borderWidth: integer("border_width").default(0),
    // borderColor: varchar("border_color", { length: 7 }),
    // borderStyle: varchar("border_style", { length: 20 }).default("solid"),
    // shadowEnabled: boolean("shadow_enabled").default(false),
    // shadowBlur: integer("shadow_blur").default(0),
    // shadowOffsetX: integer("shadow_offset_x").default(0),
    // shadowOffsetY: integer("shadow_offset_y").default(0),
    // shadowColor: varchar("shadow_color", { length: 9 }),
    elementData: jsonb("element_data").default({}),
    fromSecond: integer("from_second").notNull().default(0),
    toSecond: integer("to_second").notNull().default(-1),
    // isLocked: boolean("is_locked").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.sceneId, table.elementNumber),
    pgPolicy("Users can view own scene elements", {
      as: "permissive",
      to: "current_user",
      for: "select",
      using: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can create own scene elements", {
      as: "permissive",
      to: "current_user",
      for: "insert",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can update own scene elements", {
      as: "permissive",
      to: "current_user",
      for: "update",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can delete own scene elements", {
      as: "permissive",
      to: "current_user",
      for: "delete",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
  ]
).enableRLS();

export const sceneScripts = pgTable(
  "scene_scripts",
  {
    sceneId: text("scene_id")
      .primaryKey()
      .notNull()
      .references(() => scenes.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    script: jsonb("script").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.sceneId, table.userId),
    pgPolicy("Users can view own scene's script", {
      as: "permissive",
      to: "current_user",
      for: "select",
      using: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can create own scene's script", {
      as: "permissive",
      to: "current_user",
      for: "insert",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can update own scene's script", {
      as: "permissive",
      to: "current_user",
      for: "update",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can delete own scene's script", {
      as: "permissive",
      to: "current_user",
      for: "delete",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
  ]
).enableRLS();

// export const textFormatting = pgTable(
//   "text_formatting",
//   {
//     elementId: text("element_id")
//       .primaryKey()
//       .notNull()
//       .references(() => sceneElements.id, { onDelete: "cascade" }),
//     userId: text("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     fontFamily: varchar("font_family", { length: 100 }).default("Arial"),
//     fontSize: integer("font_size").default(14),
//     fontWeight: varchar("font_weight", { length: 20 }).default("normal"),
//     fontStyle: varchar("font_style", { length: 20 }).default("normal"),
//     textColor: varchar("text_color", { length: 7 }).default("#000000"),
//     backgroundColor: varchar("background_color", { length: 7 }),
//     isUnderlined: boolean("is_underlined").default(false),
//     isStrikethrough: boolean("is_strikethrough").default(false),
//     textTransform: varchar("text_transform", { length: 20 }).default("none"),
//     textAlign: varchar("text_align", { length: 20 }).default("left"),
//     textAlignVertical: varchar("text_align_vertical", { length: 20 }).default(
//       "top"
//     ),
//     lineHeight: decimal("line_height", { precision: 3, scale: 2 }).default(
//       "1.2"
//     ),
//     letterSpacing: decimal("letter_spacing", {
//       precision: 4,
//       scale: 2,
//     }).default("0"),
//     isHyperlink: boolean("is_hyperlink").default(false),
//     hyperlinkUrl: text("hyperlink_url"),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   },
//   (table) => [
//     check("font_style_check", sql`${table.fontStyle} IN ('normal', 'italic')`),
//     check(
//       "text_align_check",
//       sql`${table.textAlign} IN ('left', 'center', 'right', 'justify')`
//     ),
//     check(
//       "text_align_vertical",
//       sql`${table.textAlignVertical} IN ('top', 'center', 'bottom')`
//     ),
//     // check(""),
//     pgPolicy("Users can view own text formatting", {
//       as: "permissive",
//       to: "current_user",
//       for: "select",
//       using: eq(
//         table.userId,
//         sql`current_setting('app.current_user_id')::text`
//       ),
//     }),
//     pgPolicy("Users can create own text formatting", {
//       as: "permissive",
//       to: "current_user",
//       for: "insert",
//       withCheck: eq(
//         table.userId,
//         sql`current_setting('app.current_user_id')::text`
//       ),
//     }),
//     pgPolicy("Users can update own text formatting", {
//       as: "permissive",
//       to: "current_user",
//       for: "update",
//       withCheck: eq(
//         table.userId,
//         sql`current_setting('app.current_user_id')::text`
//       ),
//     }),
//     pgPolicy("Users can delete own text formatting", {
//       as: "permissive",
//       to: "current_user",
//       for: "delete",
//       withCheck: eq(
//         table.userId,
//         sql`current_setting('app.current_user_id')::text`
//       ),
//     }),
//   ]
// ).enableRLS();

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: text("id")
      .primaryKey()
      .default("media_assets_" + randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    filename: text("storage_location").notNull(),
    fileType: text("file_type").notNull(),
    fileSizeBytes: integer("file_size_bytes").notNull(),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isDeleted: boolean("is_deleted").default(false),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    pgPolicy("Users can view own media assets", {
      as: "permissive",
      to: "current_user",
      for: "select",
      using: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can create own media assets", {
      as: "permissive",
      to: "current_user",
      for: "insert",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can update own media assets", {
      as: "permissive",
      to: "current_user",
      for: "update",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can delete own media assets", {
      as: "permissive",
      to: "current_user",
      for: "delete",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
  ]
).enableRLS();

export const renderedVideos = pgTable(
  "rendered_videos",
  {
    mediaId: text("media_id")
      .primaryKey()
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("Unknown Rendered Video"),
  },
  (table) => [
    pgPolicy("Users can view own rendered videos", {
      as: "permissive",
      to: "current_user",
      for: "select",
      using: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can create own rendered videos", {
      as: "permissive",
      to: "current_user",
      for: "insert",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can update own rendered videos", {
      as: "permissive",
      to: "current_user",
      for: "update",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
    pgPolicy("Users can delete own rendered videos", {
      as: "permissive",
      to: "current_user",
      for: "delete",
      withCheck: eq(
        table.userId,
        sql`current_setting('app.current_user_id')::text`
      ),
    }),
  ]
).enableRLS();

// export const animations = pgTable("animations", {
//   id: text("id")
//     .primaryKey()
//     .default("animations_" + randomUUID()),
//   elementId: text("element_id")
//     .notNull()
//     .references(() => sceneElements.id, { onDelete: "cascade" }),
//   animationName: varchar("animation_name", { length: 50 }).notNull(),
//   animationType: varchar("animation_type", { length: 50 }).notNull(),
//   duration: integer("duration").notNull().default(500),
//   animationData: jsonb("animation_data").default({}),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// }).enableRLS();

// export const projectCollaborators = pgTable(
//   "project_collaborators",
//   {
//     id: text("id")
//       .primaryKey()
//       .default("project_collaborators_" + randomUUID()),
//     projectId: text("project_id")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),
//     userId: text("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     permissionLevel: varchar("permission_level", { length: 20 })
//       .notNull()
//       .default("viewer"),
//     invitedBy: text("invited_by").references(() => users.id, {
//       onDelete: "set null",
//     }),
//     invitedAt: timestamp("invited_at").defaultNow().notNull(),
//     acceptedAt: timestamp("accepted_at"),
//     lastAccessedAt: timestamp("last_accessed_at"),
//   },
//   (table) => ({
//     uniqueProjectUser: unique().on(table.projectId, table.userId),
//   })
// ).enableRLS();

// export const comments = pgTable("comments", {
//   id: text("id")
//     .primaryKey()
//     .default("comments_" + randomUUID()),
//   projectId: text("project_id")
//     .notNull()
//     .references(() => projects.id, { onDelete: "cascade" }),
//   sceneId: text("scene_id").references(() => scenes.id, {
//     onDelete: "cascade",
//   }),
//   elementId: text("element_id").references(() => sceneElements.id, {
//     onDelete: "cascade",
//   }),
//   authorId: text("author_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   parentCommentId: text("parent_comment_id").references(() => comments.id, {
//     onDelete: "cascade",
//   }),
//   commentText: text("comment_text").notNull(),
//   commentType: varchar("comment_type", { length: 20 }).default("comment"),
//   positionX: decimal("position_x", { precision: 8, scale: 4 }),
//   positionY: decimal("position_y", { precision: 8, scale: 4 }),
//   isResolved: boolean("is_resolved").default(false),
//   resolvedBy: text("resolved_by").references(() => users.id, {
//     onDelete: "set null",
//   }),
//   resolvedAt: timestamp("resolved_at"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   isDeleted: boolean("is_deleted").default(false),
//   deletedAt: timestamp("deleted_at"),
// }).enableRLS();

// export const projectRevisions = pgTable(
//   "project_revisions",
//   {
//     id: text("id")
//       .primaryKey()
//       .default("project_revisions_" + randomUUID()),
//     projectId: text("project_id")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),
//     revisionNumber: integer("revision_number").notNull(),
//     createdBy: text("created_by")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     changeDescription: text("change_description"),
//     snapshotData: jsonb("snapshot_data"),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//   },
//   (table) => ({
//     uniqueProjectRevision: unique().on(table.projectId, table.revisionNumber),
//   })
// ).enableRLS();

// export const activityLog = pgTable("activity_log", {
//   id: text("id")
//     .primaryKey()
//     .default("activity_log_" + randomUUID()),
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   projectId: text("project_id").references(() => projects.id, {
//     onDelete: "cascade",
//   }),
//   activityType: varchar("activity_type", { length: 50 }).notNull(),
//   activityDescription: text("activity_description"),
//   metadata: jsonb("metadata").default({}),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
// }).enableRLS();

// export const mediaInScene = pgTable(
//   "media_in_scene",
//   {
//     id: text("id")
//       .primaryKey()
//       .default("media_in_scene_" + randomUUID()),
//     sceneId: text("scene_id")
//       .notNull()
//       .references(() => scenes.id, { onDelete: "cascade" }),
//     mediaAssetId: text("media_asset_id")
//       .notNull()
//       .references(() => mediaAssets.id, { onDelete: "cascade" }),
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//   },
//   (table) => ({
//     uniqueSceneMedia: unique().on(table.sceneId, table.mediaAssetId),
//   })
// ).enableRLS();

// RLS Policies for Projects
// export const projectsPolicies = {
//   // Allow users to see their own projects
//   selectPolicy: sql`
//     CREATE POLICY "Users can view own projects" ON projects
//     FOR SELECT USING (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to insert their own projects
//   insertPolicy: sql`
//     CREATE POLICY "Users can create own projects" ON projects
//     FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to update their own projects
//   updatePolicy: sql`
//     CREATE POLICY "Users can update own projects" ON projects
//     FOR UPDATE USING (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to delete their own projects
//   deletePolicy: sql`
//     CREATE POLICY "Users can delete own projects" ON projects
//     FOR DELETE USING (user_id = current_setting('app.current_user_id')::text);
//   `,
// };

// // RLS Policies for Projects Orientation
// export const projectsOrientationPolicies = {
//   // Allow users to see project orientations for their own projects
//   selectPolicy: sql`
//     CREATE POLICY "Users can view own project orientations" ON projects_orientation
//     FOR SELECT USING (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to insert project orientations for their own projects
//   insertPolicy: sql`
//     CREATE POLICY "Users can create own project orientations" ON projects_orientation
//     FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to update project orientations for their own projects
//   updatePolicy: sql`
//     CREATE POLICY "Users can update own project orientations" ON projects_orientation
//     FOR UPDATE USING (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to delete project orientations for their own projects
//   deletePolicy: sql`
//     CREATE POLICY "Users can delete own project orientations" ON projects_orientation
//     FOR DELETE USING (user_id = current_setting('app.current_user_id')::text);
//   `,
// };

// // RLS Policies for Scenes
// export const scenesPolicies = {
//   // Allow users to see scenes for their own projects
//   selectPolicy: sql`
//     CREATE POLICY "Users can view own project scenes" ON scenes
//     FOR SELECT USING (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to insert scenes for their own projects
//   insertPolicy: sql`
//     CREATE POLICY "Users can create own project scenes" ON scenes
//     FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to update scenes for their own projects
//   updatePolicy: sql`
//     CREATE POLICY "Users can update own project scenes" ON scenes
//     FOR UPDATE USING (user_id = current_setting('app.current_user_id')::text);
//   `,

//   // Allow users to delete scenes for their own projects
//   deletePolicy: sql`
//     CREATE POLICY "Users can delete own project scenes" ON scenes
//     FOR DELETE USING (user_id = current_setting('app.current_user_id')::text);
//   `,
// };
