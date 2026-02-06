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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      historico_cambio: {
        Row: {
          created_at: string | null
          data: string
          id: string
          moeda: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data?: string
          id?: string
          moeda: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data?: string
          id?: string
          moeda?: string
          valor?: number
        }
        Relationships: []
      }
      insights_cambio: {
        Row: {
          created_at: string | null
          id: string
          mensagem: string | null
          moeda: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mensagem?: string | null
          moeda?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mensagem?: string | null
          moeda?: string | null
          status?: string
        }
        Relationships: []
      }
      leads_chatbot: {
        Row: {
          cidade_pais: string | null
          created_at: string | null
          email: string | null
          id: string
          idade: string | null
          nome: string
        }
        Insert: {
          cidade_pais?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          idade?: string | null
          nome: string
        }
        Update: {
          cidade_pais?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          idade?: string | null
          nome?: string
        }
        Relationships: []
      }
      logs_consultas_usuario: {
        Row: {
          data_consulta: string
          id: string
          moeda: string
          user_id: string | null
        }
        Insert: {
          data_consulta?: string
          id?: string
          moeda: string
          user_id?: string | null
        }
        Update: {
          data_consulta?: string
          id?: string
          moeda?: string
          user_id?: string | null
        }
        Relationships: []
      }
      logs_sistema: {
        Row: {
          created_at: string | null
          id: string
          mensagem: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mensagem?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mensagem?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      moedas: {
        Row: {
          id: string
          nome: string
          sigla: string
          updated_at: string | null
          valor_compra: number | null
          valor_venda: number | null
          variacao: number | null
        }
        Insert: {
          id?: string
          nome: string
          sigla: string
          updated_at?: string | null
          valor_compra?: number | null
          valor_venda?: number | null
          variacao?: number | null
        }
        Update: {
          id?: string
          nome?: string
          sigla?: string
          updated_at?: string | null
          valor_compra?: number | null
          valor_venda?: number | null
          variacao?: number | null
        }
        Relationships: []
      }
      noticias_b2b: {
        Row: {
          fonte: string | null
          id: string
          insight_especialista: string | null
          publicado_em: string | null
          setor: string | null
          titulo: string
          url_imagem: string | null
          url_noticia: string | null
        }
        Insert: {
          fonte?: string | null
          id?: string
          insight_especialista?: string | null
          publicado_em?: string | null
          setor?: string | null
          titulo: string
          url_imagem?: string | null
          url_noticia?: string | null
        }
        Update: {
          fonte?: string | null
          id?: string
          insight_especialista?: string | null
          publicado_em?: string | null
          setor?: string | null
          titulo?: string
          url_imagem?: string | null
          url_noticia?: string | null
        }
        Relationships: []
      }
      produtos_globais: {
        Row: {
          id: string
          nome: string
          unidade: string | null
          updated_at: string | null
          valor: number | null
          variacao: number | null
        }
        Insert: {
          id?: string
          nome: string
          unidade?: string | null
          updated_at?: string | null
          valor?: number | null
          variacao?: number | null
        }
        Update: {
          id?: string
          nome?: string
          unidade?: string | null
          updated_at?: string | null
          valor?: number | null
          variacao?: number | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          data_cadastro: string
          email: string
          id: string
          nome: string
          status_conta: string
          ultimo_acesso: string
        }
        Insert: {
          created_at?: string
          data_cadastro?: string
          email: string
          id: string
          nome?: string
          status_conta?: string
          ultimo_acesso?: string
        }
        Update: {
          created_at?: string
          data_cadastro?: string
          email?: string
          id?: string
          nome?: string
          status_conta?: string
          ultimo_acesso?: string
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
  public: {
    Enums: {},
  },
} as const
