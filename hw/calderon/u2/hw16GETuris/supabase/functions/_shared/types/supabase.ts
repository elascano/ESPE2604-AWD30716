export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action_type: string
          details: string | null
          log_id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          details?: string | null
          log_id: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          details?: string | null
          log_id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          cellphone: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          salary: number
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cellphone?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          salary: number
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cellphone?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          salary?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_reports: {
        Row: {
          created_at: string | null
          profit_loss_per_day: number
          report_id: string
          simulation_days: number
          total_profit_loss: number
        }
        Insert: {
          created_at?: string | null
          profit_loss_per_day: number
          report_id?: string
          simulation_days: number
          total_profit_loss: number
        }
        Update: {
          created_at?: string | null
          profit_loss_per_day?: number
          report_id?: string
          simulation_days?: number
          total_profit_loss?: number
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          name: string
          sku_code: string
          stock_disponible: number
          unit_of_measurement: string
        }
        Insert: {
          name: string
          sku_code: string
          stock_disponible?: number
          unit_of_measurement: string
        }
        Update: {
          name?: string
          sku_code?: string
          stock_disponible?: number
          unit_of_measurement?: string
        }
        Relationships: []
      }
      inventory_batches: {
        Row: {
          batch_id: string
          cost_per_unit: number
          created_at: string | null
          purchase_date: string
          quantity: number
          sku_code: string | null
        }
        Insert: {
          batch_id: string
          cost_per_unit: number
          created_at?: string | null
          purchase_date: string
          quantity: number
          sku_code?: string | null
        }
        Update: {
          batch_id?: string
          cost_per_unit?: number
          created_at?: string | null
          purchase_date?: string
          quantity?: number
          sku_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_sku_code_fkey"
            columns: ["sku_code"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["sku_code"]
          },
        ]
      }
      menu_item_ingredients: {
        Row: {
          item_id: string
          quantity_required: number | null
          sku_code: string
        }
        Insert: {
          item_id: string
          quantity_required?: number | null
          sku_code: string
        }
        Update: {
          item_id?: string
          quantity_required?: number | null
          sku_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "menu_item_ingredients_sku_code_fkey"
            columns: ["sku_code"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["sku_code"]
          },
        ]
      }
      menu_items: {
        Row: {
          created_at: string | null
          description: string | null
          image_url: string | null
          is_available: boolean | null
          item_id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          is_available?: boolean | null
          item_id: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          is_available?: boolean | null
          item_id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      order_details: {
        Row: {
          created_at: string | null
          id: number
          ingredient_cost: number
          item_id: string | null
          order_id: string | null
          quantity: number
          removed_ingredients: Json | null
          selling_price: number
        }
        Insert: {
          created_at?: string | null
          id?: never
          ingredient_cost: number
          item_id?: string | null
          order_id?: string | null
          quantity: number
          removed_ingredients?: Json | null
          selling_price: number
        }
        Update: {
          created_at?: string | null
          id?: never
          ingredient_cost?: number
          item_id?: string | null
          order_id?: string | null
          quantity?: number
          removed_ingredients?: Json | null
          selling_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_details_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "order_details_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          order_date_time: number
          order_id: string
          status: string
          total_amount: number
          transaction_fee: number | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          order_date_time: number
          order_id: string
          status?: string
          total_amount: number
          transaction_fee?: number | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          order_date_time?: number
          order_id?: string
          status?: string
          total_amount?: number
          transaction_fee?: number | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          customer_id: string | null
          date: string
          duration: number
          notes: string | null
          number_of_people: number
          reservation_id: string
          status: string
          time: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          date: string
          duration?: number
          notes?: string | null
          number_of_people: number
          reservation_id: string
          status?: string
          time: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          date?: string
          duration?: number
          notes?: string | null
          number_of_people?: number
          reservation_id?: string
          status?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      surveys: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_name: string
          id: number
          rating: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_name: string
          id?: never
          rating?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_name?: string
          id?: never
          rating?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          name: string
          password_hash: string
          phone: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          name: string
          password_hash: string
          phone?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          name?: string
          password_hash?: string
          phone?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
